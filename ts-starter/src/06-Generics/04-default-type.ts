type ApiResponse<T = unknown> = {
  status: number;
  data: T;
};

const res1: ApiResponse<string> = {
  status: 200,
  data: "OK",
};

const res2: ApiResponse = {
  status: 200,
  data: { any: "thing" },
};

// res2.data.toUpperCase();
