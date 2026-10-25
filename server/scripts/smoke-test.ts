    const API =
    "http://127.0.0.1:3000/api";

    const loginResponse =
    await fetch(
        `${API}/auth/login`,
        {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body:
            JSON.stringify({
            username:
                "admin",
            password:
                "admin123"
            })
        }
    );

    if (
    !loginResponse.ok
    ) {
    throw new Error(
        "TEST LOGIN : ECHEC"
    );
    }

    type LoginResult = {
    token: string;
        };

        const login =
        (await loginResponse.json()) as LoginResult;

            console.log(
            "LOGIN : OK"
            );

    const authenticatedGet =
    async (
        path: string
    ) => {
        const response =
        await fetch(
            `${API}${path}`,
            {
            headers: {
                Authorization:
                `Bearer ${login.token}`
            }
            }
        );

        if (!response.ok) {
        throw new Error(
            `ECHEC : ${path}`
        );
        }

        console.log(
        `OK : ${path}`
        );

        return response.json();
    };

    await authenticatedGet(
    "/dashboard"
    );

    await authenticatedGet(
    "/producers"
    );

    await authenticatedGet(
    "/lots"
    );

    await authenticatedGet(
    "/quality-checks"
    );

    await authenticatedGet(
    "/collections"
    );

    await authenticatedGet(
    "/transports"
    );

    await authenticatedGet(
    "/receptions"
    );

    await authenticatedGet(
    "/products"
    );

    await authenticatedGet(
    "/productions"
    );

    await authenticatedGet(
    "/finished-batches"
    );

    await authenticatedGet(
    "/stocks"
    );

    await authenticatedGet(
    "/customers"
    );

    await authenticatedGet(
    "/sales"
    );

    await authenticatedGet(
    "/non-conformities"
    );

    await authenticatedGet(
    "/traceability/PF-20260910-001"
    );

    console.log("");
    console.log(
    "=============================="
    );

    console.log(
    " TOUS LES TESTS API : OK"
    );

    console.log(
    "=============================="
    );
