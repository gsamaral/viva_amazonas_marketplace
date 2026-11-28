import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.BASE_URL || 'http://localhost:4000';

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '40s', target: 50 },
    { duration: '20s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
    checks: ['rate>0.99']
  }
};

export default function () {
  const city = __ITER % 2 === 0 ? 'Manaus' : 'Presidente Figueiredo';
  const response = http.get(`${baseUrl}/api/tours?city=${encodeURIComponent(city)}`);

  check(response, {
    'city filter returns HTTP 200': res => res.status === 200,
    'city filter returns only matching tours': res => {
      try {
        const tours = res.json();
        return Array.isArray(tours) && tours.every(tour => tour.city === city);
      } catch {
        return false;
      }
    }
  });

  sleep(0.5);
}
