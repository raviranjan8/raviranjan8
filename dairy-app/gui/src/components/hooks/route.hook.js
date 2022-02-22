import React, { useState , useEffect } from "react";
import RouteService from "../../services/route.service";

export const useRoutes = () => {
  const [selectData, setSelectData] = useState();
  useEffect(() => {
    if(!selectData || selectData.length === 0){
      RouteService.getAll()
      .then(response => {
        setSelectData(response.data);
        console.log(selectData);
      })
      .catch(e => {
        console.log(e);
      });
    }
  }, [selectData]);
  return {selectData};
}