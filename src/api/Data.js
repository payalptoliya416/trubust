import axios from "axios";

const BASE_URL = 'https://api.truebust.com/api/'

let authToken = localStorage.getItem('authToken') || '';

export const getAuthToken = () => authToken;

const saveAuthTokenToLocalStorage = (token) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const removeAuthTokenFromLocalStorage = () => {
  authToken = '';
  localStorage.removeItem('authToken');
};

export const fetchLogin = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}admin/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      const { token } = response.data;
      saveAuthTokenToLocalStorage(token);
      authToken = token;
      return { success: true, data: response, token };
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Error submitting data:', error);
    throw error;
  }
};

export const fetchAnalyticRequest = async (id) => {
  try {
    const authToken = getAuthToken();
    let url = id
      ? `${BASE_URL}dashboard/Counter?companyID=${id}`
      : `${BASE_URL}dashboard/Counter`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();

    const res = data;
    return res;
  } catch (error) {
    console.error('Error fetching Analytic Request:', error);
    return { success: false, error: 'Error fetching Analytic Request' };
  }
};

export const fetchTotalCompany = async () => {
  try {
    const url = `${BASE_URL}company/GetCompanyRequest`;
    const authToken = getAuthToken();

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching fetchTotalCompany:", error);
    throw error;
  }
};

export const fetchAnalyticUsers = async (id) => {
  try {
    const authToken = getAuthToken();
    let url = `${BASE_URL}user/GetTopUsers?companyID=${id}`
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const users = await response.json();
    const userResponse = users;
    return userResponse;
  } catch (error) {
    console.error('Error fetching Analytic Users Request:', error);
    return { success: false, error: 'Error fetching Analytic Users Request' };
  }
};

export const fetchData = async (companyName = '', email = '', country = '') => {
  try {
    const url = `${BASE_URL}company/GetCompany?companyname=${companyName}&email=${email}&country=${country}`;
    const authToken = getAuthToken();

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const addOrUpdateCompany = async (formData) => {
  try {
    authToken = getAuthToken();
    const response = await axios.post(
      `${BASE_URL}company/AddOrUpdate`,
      JSON.stringify(formData),
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      },
    )
    if (response.status === 200) {
      return {
        success: true, data: response.data.data
      };

    } else {
      return {
        success: false,
        error: response.data.status || 'Failed to add/update company',
      };
    }
  } catch (error) {
    console.error('Error adding/updating company:', error.data);
    return { success: false, error: error.message || 'An error occurred' };
  }
};

export const fetchDelete = async (id) => {
  try {
    const authToken = getAuthToken();

    const response = await axios.post(
      `${BASE_URL}company/Delete`,
      { companyID: id },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    return { success: false, error: 'Error deleting company' };
  }
};

export const fetchCompanyView = async (cID) => {
  try {
    const authToken = getAuthToken();
    let url = `${BASE_URL}company/SingleCompany?comapnyID=${cID}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      throw new Error('Failed to fetch CompanyView Page');
    }
  } catch (error) {
    console.error('Error fetching CompanyView Page:', error);
    return { success: false, error: 'Error fetching CompanyView Page' };
  }
};

export const fetchSignleComUser = async (uscomID) => {
  try {
    const authToken = getAuthToken();
    let url = `${BASE_URL}company/CompanyUserList?comapnyID=${uscomID}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching SignleCompanyUser List:', error);
    return { error: 'Error fetching SignleCompanyUser List' };
  }
};

export const fetchUserList = async (ID = '', name = '', email = '', phone = '',) => {

  try {
    const authToken = getAuthToken();

    let url = ID
      ? `${BASE_URL}user/GetUser?companyID=${ID}&name=${name}&email=${email}&phoneno=${phone}`
      : `${BASE_URL}user/GetUser?name=${name}&email=${email}&phoneno=${phone}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      throw new Error('Failed to fetch user list');
    }
  } catch (error) {
    console.error('Error fetching user list:', error);
    return { success: false, error: 'Error fetching user list' };
  }
};

export const fetchDeleteUser = async (id) => {
  try {
    const authToken = getAuthToken();
    const response = await axios.post(
      `${BASE_URL}user/Delete`,
      { userID: id },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.data.message || 'Error deleting user',
      };
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Error deleting user' };
  }
};

export const sendVerification = async (id) => {

  try {
    const authToken = getAuthToken();

    const response = await axios.post(
      `${BASE_URL}user/GenerateOtp`,
      { userID: id },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('Error GenerateOtp:', error);
    return { success: false, error: 'Error GenerateOtp' };
  }
};

export const addOrUpdateUser = async (formData) => {
  try {
    authToken = getAuthToken();
    const response = await axios.post(
      `${BASE_URL}user/AddOrUpdate`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      }
    );
    if (response.status) {
      return { success: true, data: response };
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to add/update company',
      };
    }
  } catch (error) {
    console.error('Error adding/updating user:', error);
    return { success: false, error: error.response.data.message || 'An error occurred' };
  }
};

export const fetchTicketList = async () => {
  try {
    const authToken = getAuthToken();
    const url = `${BASE_URL}supportTicket/GetsupportTicket`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching ticket list:', error);
    return { error: 'Error fetching ticket list' };
  }
};

export const fetchTicketReplay = async (ticketID) => {
  try {
    const authToken = getAuthToken();
    let url = `${BASE_URL}supportTicket/GetReplay?userID=${ticketID}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching ticket list:', error);
    return { error: 'Error fetching ticket list' };
  }
};

export const postComment = async (currentTicketID, commentText, currentCompanyID, image) => {

  try {
    const authToken = getAuthToken();
    const url = `${BASE_URL}supportTicket/admin/send`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        receiverID: currentTicketID,
        companyID: currentCompanyID,
        message: commentText,
        image: image
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting comment:', error);
    return { error: 'Error posting comment' };
  }
};

export const fetchRequstList = async (id) => {
  try {
    const authToken = getAuthToken();
    let url = id
      ? `${BASE_URL}externalrequest/GetAllRequest?companyID=${id}`
      : `${BASE_URL}externalrequest/GetAllRequest`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      throw new Error('Failed to fetch Requst list');
    }
  } catch (error) {
    console.error('Error fetching Requst list:', error);
    return { success: false, error: 'Error fetching Requst list' };
  }
};

export const fetchRequestReplay = async (companyID, userID, requestID) => {

  try {
    const authToken = getAuthToken();
    const url = ` ${BASE_URL}admin/externalrequest/GetReplay?userID=${userID}&companyID=${companyID}&requestID=${requestID}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching fetchRequestReplay list:', error);
    return { error: 'Error fetching fetchRequestReplay list' };
  }
};

export const postExternalChat = async (currentUserID, commentText, currentCompanyID, image, currentID) => {
  try {
    const authToken = getAuthToken();
    const url = `${BASE_URL}admin/externalrequest/replay`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        externalrequestID: currentID,
        userID: currentUserID,
        companyID: currentCompanyID,
        message: commentText,
        image: image

      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: 'Error postExternalChat comment' };
  }
};

export const fetchApproveORDecline = async (id, status) => {
  try {
    const authToken = getAuthToken();
    let url = `${BASE_URL}externalrequest/ApproveORDecline`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        requestID: id,
        status: status
      })
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      throw new Error('Failed to fetch');
    }
  } catch (error) {
    console.error('Error', error);
    return { success: false, error: 'Error' };
  }
};

export const fetchInternalRequest = async (id) => {
  try {
    const authToken = getAuthToken();
    let url = id
      ? `${BASE_URL}internalrequest/GetInternalRequest?companyID=${id}`
      : `${BASE_URL}internalrequest/GetInternalRequest`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    const res = data.data;
    return res;
  } catch (error) {
    console.error('Error fetching CompanyView Page:', error);
    return { success: false, error: 'Error fetching InternalRequest' };
  }
};

export const fetchGroupChat = async (id) => {
  try {
    const authToken = getAuthToken();
    let url = id
      ? `${BASE_URL}groupchat/GroupChatList?companyID=${id}`
      : `${BASE_URL}groupchat/GroupChatList`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    const res = data;
    return res;
  } catch (error) {
    console.error('Error fetching GroupChat:', error);
    return { success: false, error: 'Error fetching GroupChat' };
  }
};

export const fetchChatList = async (uscomID) => {
  try {
    const authToken = getAuthToken();
    let url = `${BASE_URL}groupchat/getGroupChat?companyID=${uscomID}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ticket list:', error);
    return { error: 'Error fetching ticket list' };
  }
};

export const postGroupchat = async (companyID, commentText, image) => {
  try {
    const authToken = getAuthToken();
    const url = `${BASE_URL}groupchat/admin/send`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        companyID: companyID,
        message: commentText,
        image: image
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error postGroupchat comment:', error);
    return { error: 'Error postGroupchat comment' };
  }
};

export const adminUsers = async () => {
  try {
    const url = `${BASE_URL}admin/list`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching admin user List:', error);
    return { error: 'Error fetching admin user List' };
  }
};

export const fetchDeleteAdmin = async (id) => {

  try {

    const response = await axios.post(
      `${BASE_URL}admin/delete`,
      { id: id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    return { success: false, error: 'Error deleting company' };
  }
};

export const adminUserAdd = async (formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}admin/insert`,
      JSON.stringify(formData),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (response.status === 200) {
      return {
        success: true, data: response.data
      };

    } else {
      return {
        success: false,
        error: response.data.status || 'Failed to add AdminUser',
      };
    }
  } catch (error) {
    console.error('Error adding AdminUser:', error.data);
    return { success: false, error: error.message || 'An error occurred' };
  }
};

export const fetchRoleList = async () => {
  try {
    const url = `${BASE_URL}role/list`;
    const response = await axios.get(url);
    const data = response.data
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fecthRoleDelete = async (id) => {

  try {

    const response = await axios.post(
      `${BASE_URL}role/delete`,
      { id: id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('Error deleting company:', error);
    return { success: false, error: 'Error deleting company' };
  }
}

export const fetchEditShow = async (ID) => {

  try {
    let url = `${BASE_URL}admin/edit/${ID}`;
    const response = await fetch(url);
    const data = await response.json();
    const res = data.response.admin
    return res;
  } catch (error) {
    console.error('Error fetching adminuser:', error);
    return { error: 'Error fetching adminuser ' };
  }
};

export const AdminEditPost = async (formData) => {
  try {

    const response = await axios.post(
      `${BASE_URL}admin/edit/post`, JSON.stringify(formData)
      ,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      return { success: true, data: response };
    } else {
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('Error edit:', error);
    return { success: false, error: 'Error edit' };
  }
};

export const RoleAdd = async (name) => {
  try {
    const response = await axios.post(
      `${BASE_URL}role/add`,
      JSON.stringify(name),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      )
     if (response.status === 200) {
      return { success: true, data: response
     }; 

    } else {
      return {
        success: false,
        error: response.data.status || 'Failed to add AdminUser',
      };
    }
  } catch (error) {
    console.error('Error adding AdminUser:', error.data);
    return { success: false, error: error.message || 'An error occurred' };
}
};

export const fetchRoleEdit = async (ID) => {

  try {
    let url = `${BASE_URL}role/edit/${ID}`; 
    const response = await fetch(url);
    const data = await response.json(); 
    const res = data.response.role
    return res;
  } catch (error) {
    console.error('Error fetching adminuser:', error);
    return { error: 'Error fetching adminuser ' };
  }
};

export const roleEditRole = async (formData) => {
  try {

    const response = await axios.post(
      `${BASE_URL}role/edit`,JSON.stringify(formData)
     ,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      return { success: true, data: response };
    } else {
      return {
        success: false,
        error: response.data.message,
      };
    }
  } catch (error) {
    console.error('Error edit:', error);
    return { success: false, error: 'Error edit' };
  }
};

export const fetchLogs = async (token) => {
  try {
    const url = `${BASE_URL}logs/SystemLog`;
    const authToken = token || getAuthToken();

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching Logs:", error);
    throw error;
  }
};

export const fetchErrorLogs = async (token) => {
  try {
    const url = `${BASE_URL}logs/ErrorLog`;
    const authToken = token || getAuthToken();
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching Logs:", error);
    throw error;
  }
};

export const fetchPermissionList = async (id) => {
  try {
    const url = `${BASE_URL}role/get-permission-list/${id}`;
    const response = await axios.get(url);  
    const data = response.data.response
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchAllPermissionList = async () => {
  try {
    const url = `${BASE_URL}permission/list`;
    const response = await axios.get(url);
    const data = response.data.data.permissions
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const EditRolePermission = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}role/permission-edit`,
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      )
     if (response.status === 200) {
      return { success: true, data: response 
     }; 

    } else {
      return {
        success: false,
        error: response.data.status || 'Failed to edit RolePermission',
      };
    }
  } catch (error) {
    console.error('Error editing RolePermission:', error.data);
    return { success: false, error: error.message || 'An error occurred' };
}
};

export const AddRolePermission = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}role/permission-edit`,
      JSON.stringify(payload),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      )
     if (response.status === 200) {
      return { success: true, data: response 
     }; 

    } else {
      return {
        success: false,
        error: response.data.status || 'Failed to add RolePermission',
      };
    }
  } catch (error) {
    console.error('Error adding RolePermission:', error.data);
    return { success: false, error: error.message || 'An error occurred' };
}
};