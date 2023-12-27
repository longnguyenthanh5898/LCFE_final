import axios from "axios";

const API_AUTH_URL = "http://localhost:8223/api/auth/";
/* create file env or config file to store API URL, SECRET,...*/

const API_URL = "http://localhost:8223/api/v1/members";

class UserService {
  login(user) {
    const { customer_id, password } = user;

    return axios.post(
      API_AUTH_URL + "login",
      {
        customerId: String(customer_id),
        password: String(password),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  logOut() {
    return axios.post(API_URL + "logout", {});
  }

  register(user, response) {
    return axios.post(API_AUTH_URL + "register", user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${response}`,
      },
    });
  }

  changeRole(username, role) {
    return axios.put(API_URL + username + "/change/" + role, {});
  }

  findAllUsers(token, page) {
    return axios.get(
      API_URL,

      {
        params: { page: page },
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
  }
  searchMember(params, token) {
    return axios.get(API_URL, {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
  }
/* create AXIOS file to config authen  token, header, method, param, refresh token,...*/
  exportExcel(params, token) {
    return axios.get(API_URL + "/export", {
      params: params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      responseType: "arraybuffer",
    });
  }
/* create AXIOS file to config authen  token, header, method, param, refresh token,...*/
  editMember(user, token) {
    return axios.put(API_URL + `/${user.id}`, user, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
  }
  deleteMember(id, token) {
    return axios.delete(API_URL + `/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
  }
  checkDuplicate(id) {
    return axios.post(API_AUTH_URL + "check?customerId=" + id
      ,
      // {
      // customerId: String(id) 
      // },
      {
      headers: {
        "Content-Type": "application/json"
      }
    }
    );
  }
  

}

export default new UserService();
