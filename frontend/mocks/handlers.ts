import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://www.bitsanddroids.com/api/release", () => {
    return HttpResponse.json([
      {
        version: "1.0.0",
        name: "msw",
        publishedAt: "2021-01-01",
        body: "mock release",
      },
      {
        version: "1.0.1",
        name: "msw",
        publishedAt: "2021-01-02",
        body: "mock release 2",
      },
    ]);
  }),
];
