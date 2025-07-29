import React, { createContext, useContext, useState, ReactNode } from "react";

// This context will store and provide access to a single piece of data (any type)
type DataContextValue = {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
};

const DataContext = createContext<DataContextValue>({
  data: null,
  setData: () => {
    throw new Error("setData called outside of DataProvider");
  },
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any>(null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
