const URLS = {
  register: "https://functions.poehali.dev/a18cd4ee-3b49-419d-a765-11c393041763",
  login: "https://functions.poehali.dev/dfcb7287-3f34-4973-902a-ea934d0fc253",
  verify: "https://functions.poehali.dev/f2bd4075-ccb3-45dc-b184-934f1ed1217b",
  me: "https://functions.poehali.dev/d904064a-04fc-4356-b1dd-6049a9547729",
  waitlist: "https://functions.poehali.dev/b97c2eda-6490-49a8-a8b5-b3269d91e028",
};

async function post(url: string, body: object, token?: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "X-Auth-Token": token } : {}),
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiRegister(phone: string, nickname: string, password: string) {
  return post(URLS.register, { phone, nickname, password });
}

export async function apiVerify(phone: string, code: string) {
  return post(URLS.verify, { phone, code });
}

export async function apiLogin(phone: string, password: string) {
  return post(URLS.login, { phone, password });
}

export async function apiMe(token: string) {
  const res = await fetch(URLS.me, { headers: { "X-Auth-Token": token } });
  return res.json();
}

export async function apiWaitlist(phone: string) {
  return post(URLS.waitlist, { phone });
}
