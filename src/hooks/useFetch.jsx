// import React, { useEffect, useState } from 'react';
import axios from "axios";

export function useFetch() {
  const url = "https://tiny-gray-tortoise-robe.cyclic.app";
  const FetchData = (path, type, payload = null) => {
    return type === "get"
      ? axios.get(url + path, { withCredentials: true })
      : axios.post(url + path, payload, { withCredentials: true });
  };

  // return {data , isLoading , isError , FetchData , handlePromise}
  return FetchData;
}
