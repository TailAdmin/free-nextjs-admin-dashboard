"use client";

import React, { useEffect, useState } from "react";
import {
  DtsListPostRequest,
  DtsResourceApi,
} from "../../openapi-client/apis/DtsResourceApi";
import {
  DtsFilterFromJSON,
  DtsVO,
  EntityState,
} from "../../openapi-client/models";
import { DtsFilter } from "../../openapi-client/models";
import { Configuration, ConfigurationParameters } from "../../openapi-client";
import { useAuth } from "react-oidc-context";
import { Log } from "oidc-client-ts";
import Link from "next/link";
import DropdownDefault from "../Dropdowns/DropdownDefault";

function DtsList() {
  const [dtsVOs, setDtsVOs] = useState<DtsVO[]>([]);

  const [searchText, setSerchText] = useState("");

  let [filterState, setFilterState] = useState<Partial<DtsVO["state"]>>();

  const auth = useAuth();

  Log.setLogger(console);
  Log.setLevel(Log.DEBUG);

  function listDtsVOs() {
    const configParameters: ConfigurationParameters = {
      headers: {
        Authorization: "Bearer " + auth.user?.access_token,
      },
      basePath: process.env.BACKEND_BASE_PATH,
    };

    const config = new Configuration(configParameters);
    const api = new DtsResourceApi(config);

    class DtsFilterClass implements DtsFilter {
      state?: EntityState;
    }
    //const filter = DtsFilterFromJSON('');

    const filterw = new DtsFilterClass();
    //filterw.state = EntityState.Enabled;

    class DtsListPostRequestClass implements DtsListPostRequest {
      dtsFilter?: DtsFilter;
    }
    const requestParameters = new DtsListPostRequestClass();
    requestParameters.dtsFilter = filterw;

    api.dtsListPost(requestParameters).then((resp) => setDtsVOs(resp));
  }

  function setState(id: DtsVO["id"], state: DtsVO["state"]) {
    let [filteredDts] = dtsVOs.filter(({ id: idDts }) => {
      return idDts == id;
    });
    filteredDts = {
      ...filteredDts,
      state,
    };
    setDtsVOs((state) => [...state, filteredDts]);
  }

  useEffect(() => {
    console.log("going here " + auth.isAuthenticated);
    if (auth.isAuthenticated) {
      listDtsVOs();
    }
  }, [auth]);

  function InputSearch(): JSX.Element {
    return (
      <div className="">
        <input
          type="text"
          placeholder="search services"
          value={searchText}
          onChange={(e) => {}}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        {/* onChange​= {(e) => setDtsVO({...dtsVO, name: e.target.value})}  */}
      </div>
    );
  }

  function SelectStateFilter({
    className,
  }: {
    className: string;
  }): JSX.Element {
    return (
      <select className={className} value={filterState} defaultValue="">
        {Object.values(EntityState)
          .map((state, idx) => {
            return (
              <option
                value={state}
                key={idx}
                onChange={() => {
                  setFilterState((prevState) => (prevState = state)); //Pending to fix filter
                }}
              >
                {state}
              </option>
            );
          })
          .concat(<option value="">Filter By State</option>)}
      </select>
    );
  }

  function filterByState(
    this: DtsVO["state"],
    value: DtsVO,
    idx: number,
    arr: DtsVO[],
  ) {
    let stateToFilter: DtsVO["state"] = this;
    if (stateToFilter) {
      return value.state == stateToFilter;
    } else {
      return value;
    }
  }

  if (auth.isAuthenticated) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-15 flex w-full flex-row justify-between px-4">
          <div>
            <button onClick={listDtsVOs}>refresh</button>
          </div>
          <div className="flex flex-row space-x-4 align-top">
            <InputSearch></InputSearch>
            <SelectStateFilter className="h-10 w-auto"></SelectStateFilter>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 text-center font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>

                <th className="min-w-[120px] px-4 py-4 text-center font-medium text-black dark:text-white">
                  Template Repo
                </th>
                <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                  Template
                </th>
                <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                  Connections
                </th>
                <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                  Modified
                </th>
                <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                  State
                </th>
                <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dtsVOs.filter(filterByState, filterState).map((dts, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 text-center dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {dts.name}
                    </h5>
                  </td>

                  <td className="border-b border-[#eee] px-4 py-5 pl-9 text-center dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      Template Repo
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 text-center dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      Template
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 text-center dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      Connections
                    </h5>
                  </td>

                  <td className="border-b border-[#eee] px-4 py-5 pl-9 text-center dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {String(dts.createdTs)}
                    </h5>
                  </td>
                  {/* <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                     <h5 className="font-medium text-black dark:text-white">
                      {dts.state}
                    </h5> 
                    <select
                      name="state"
                      id="cars"
                      defaultValue={dts.state}
                      className="dark:bg-black dark:text-white"
                    >
                      {Object.values(EntityState).map((value, idx) => {
                        return (
                          <option
                            value={value}
                            key={idx}
                            onChange={() => {
                              setState(dts.id, value);
                            }}
                          >
                            {value}
                          </option>
                        );
                      })}

                    </select> 
                  </td>
                        */}
                  <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                        dts.state === "ENABLED"
                          ? "bg-success text-success"
                          : dts.status === "DISABLED"
                            ? "bg-danger text-danger"
                            : "bg-warning text-warning"
                      }`}
                    >
                      {dts.state}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <Link href={"/services/" + dts.id}>
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                            fill=""
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                            fill=""
                          />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={listDtsVOs}>refresh</button>
      </div>
    );
  } else {
    return <div>You are not authenticated.</div>;
  }
}

export default DtsList;
