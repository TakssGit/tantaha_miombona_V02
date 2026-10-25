const API =
  "http://127.0.0.1:3000/api";

const assert = (
  condition: boolean,
  message: string
) => {
  if (!condition) {
    throw new Error(message);
  }
};

const request = async (
  path: string,
  options:
    RequestInit = {}
) => {
  const response =
    await fetch(
      `${API}${path}`,
      options
    );

  const body: any =
    await response.json()
      .catch(() => null);

  return {
    response,
    body
  };
};

const health =
  await request(
    "/health"
  );

assert(
  health.response.ok,
  "Health API en échec"
);

console.log(
  "HEALTH : OK"
);

const invalidLogin =
  await request(
    "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        username:
          "__invalid__",
        password:
          "__invalid__"
      })
    }
  );

assert(
  invalidLogin.response.status ===
    401,
  "Le mauvais login doit être refusé"
);

console.log(
  "LOGIN INVALIDE REFUSÉ : OK"
);

const login =
  await request(
    "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        username: "admin",
        password: "admin123"
      })
    }
  );

assert(
  login.response.ok,
  "Login admin en échec"
);

const token =
  String(
    login.body?.token || ""
  );

assert(
  token.length > 20,
  "JWT absent"
);

console.log(
  "LOGIN ADMIN : OK"
);

const headers = {
  Authorization:
    `Bearer ${token}`
};

const protectedPaths = [
  "/auth/me",
  "/dashboard",
  "/producers",
  "/lots",
  "/products",
  "/stocks",
  "/traceability/PF-20260910-001",
  "/admin/users",
  "/forecasts",
  "/orders",
  "/system/diagnostics"
];

for (
  const path of protectedPaths
) {
  const result =
    await request(
      path,
      {
        headers
      }
    );

  assert(
    result.response.ok,
    `Échec : ${path}`
  );

  console.log(
    `OK : ${path}`
  );
}

const publicCatalog =
  await request(
    "/public/catalog"
  );

assert(
  publicCatalog.response.ok,
  "Catalogue public en échec"
);

console.log(
  "CATALOGUE PUBLIC : OK"
);

const noToken =
  await request(
    "/dashboard"
  );

assert(
  noToken.response.status ===
    401,
  "Une route protégée accepte une requête sans token"
);

console.log(
  "ROUTE SANS TOKEN REFUSÉE : OK"
);

console.log("");
console.log(
  "===================================="
);
console.log(
  " TEST FINAL TANTSAHA : TOUS OK"
);
console.log(
  "===================================="
);
