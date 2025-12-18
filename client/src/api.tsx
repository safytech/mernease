import axios from "axios";
import { useSelector } from "react-redux";
import React from "react";
import { useLoading } from "./context/LoadingContext";

export const useApi = () => {
  const { startRequest, endRequest } = useLoading();
  const { currentUser } = useSelector((state: any) => state.user);

  const api = React.useMemo(() => {
    const instance = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    instance.interceptors.request.use(
      (config) => {
        try {
          startRequest();
        } catch (e) {
        }
        if (currentUser) {
          config.headers = config.headers || {};
          config.headers["Audit_user_id"] = currentUser._id;
          if (currentUser.token) {
            config.headers["Authorization"] = `Bearer ${currentUser.token}`;
          }
        }
        return config;
      },
      (error) => {
        try {
          endRequest();
        } catch (e) {}
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        try {
          endRequest();
        } catch (e) {}
        return response;
      },
      (error) => {
        try {
          endRequest();
        } catch (e) {}

        if (error.response && error.response.status === 401) {
          console.warn("Session expired or unauthorized. Redirecting to login...");

          localStorage.removeItem("persist:root");
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.location.href = "/auth/signin";
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [startRequest, endRequest, currentUser]);

  return api;
};

type Listener = (count: number) => void;
let activeRequests = 0;
let listeners: Listener[] = [];

const apiTracker = {
  start: () => {
    activeRequests++;
    notify();
  },
  end: () => {
    activeRequests = Math.max(0, activeRequests - 1);
    notify();
  },
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    listener(activeRequests);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};

function notify() {
  listeners.forEach((l) => l(activeRequests));
}

const trackerApi = axios.create();

trackerApi.interceptors.request.use((c) => {
  apiTracker.start();
  return c;
});
trackerApi.interceptors.response.use(
  (r) => {
    apiTracker.end();
    return r;
  },
  (e) => {
    apiTracker.end();
    return Promise.reject(e);
  }
);

export const useApiStatus = () => {
  const [pending, setPending] = React.useState<number>(0);
  React.useEffect(() => {
    const unsub = apiTracker.subscribe(setPending);
    return unsub;
  }, []);
  return { pending, allCompleted: pending === 0 };
};
