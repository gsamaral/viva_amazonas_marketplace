import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.BASE_URL || 'http://localhost:4000';

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '40s', target: 10 },
    { duration: '20s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
    checks: ['rate>0.99']
  }
};

export default function () {
  const response = http.get(`${baseUrl}/api/tours`);
  const isJsonArray = check(response, {
    'catalog returns HTTP 200': res => res.status === 200,
    'catalog returns a JSON array': res => {
      try {
        return Array.isArray(res.json());
      } catch {
        return false;
      }
    }
  });

  if (!isJsonArray) {
    console.error(`Unexpected catalog response status: ${response.status}`);
  }

  sleep(1);
}
