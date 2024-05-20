"use client";

import React, { useEffect, useState } from 'react';
import { DtsListPostRequest, DtsResourceApi } from '../../openapi-client/apis/DtsResourceApi'; 
import { DtsFilterFromJSON, DtsTemplateVO, DtsVO, EntityState } from '../../openapi-client/models';
import { DtsFilter } from '../../openapi-client/models';
import { Configuration, ConfigurationParameters, DtsTemplateResourceApi } from '../../openapi-client';
import { useAuth } from "react-oidc-context";
import { Log } from 'oidc-client-ts';
import { usePathname } from 'next/navigation';
import SelectDtsTemplate from '../Templates/SelectDtsTemplate';
import {v4 as uuidv4} from 'uuid';




function DtsViewEdit() {

  const [dtsVO, setDtsVO] = useState<DtsVO>();
  const auth = useAuth();
  const pathname = usePathname()
  let dtsName;
  let debugInitialValue;

  const [dtsTemplateVOs, setDtsTemplateVOs] = useState<DtsTemplateVO[]>([]);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };
  
  
  
  let idinurl = pathname.replace("/services/", "");

  console.log(idinurl);
  
  function listDtsTemplateVOs() {
    const configParameters: ConfigurationParameters = {
      headers: {
        'Authorization': 'Bearer ' + auth.user?.access_token ,
        
      },
      basePath: 'http://localhost:2601/',
    };
    
  
    const config = new Configuration(configParameters);
    const apiDtst = new DtsTemplateResourceApi(config);
    
    
    apiDtst.dtstListPost({}).then((resp) => setDtsTemplateVOs(resp));
  }

   
  useEffect(() => {
    console.log("going here " + auth.isAuthenticated);
    if (auth.isAuthenticated) {
      
      listDtsTemplateVOs();
    }
    

}, [auth]);


  function getDtsVO() {

    if ((idinurl === null) || (idinurl === "new")) {
      
      setDtsVO({...dtsVO, name: "New Decentralized Trusted Service", id: uuidv4(), templateFk:"newTemplateFk", debug: false})
    
    } else {
      const configParameters: ConfigurationParameters = {
        headers: {
          'Authorization': 'Bearer ' + auth.user?.access_token ,
          
        },
        basePath: 'http://localhost:2601/',
      };
      
    
      const config = new Configuration(configParameters);
      const api = new DtsResourceApi(config);
      
      api.dtsGetIdGet({ id: idinurl}).then((resp: React.SetStateAction<DtsVO | undefined>) => { 
        if (resp) {
          setDtsVO(resp);
          setIsOptionSelected(true);
        } else {
          setDtsVO({...dtsVO, name: "New Decentralized Trusted Service", id: uuidv4()})
        }
        
      });
     
      
  dtsVO?.deploymentConfig?.orchestratorUrl;

  console.log("orchestratorUrl:" + dtsVO?.deploymentConfig?.orchestratorUrl);
    }
    
  }

  function getDeploymentConfigKeys(): string[] {

    let keylist:  string[] = [];

    for (const key in dtsVO?.deploymentConfig)
      {

        keylist.push(key);
        
        
         
      }
    return keylist;
  }

  function handleDeploymentConfigValueChange(key: string, e: React.ChangeEvent<HTMLInputElement>) {

    let deploymentConf = dtsVO?.deploymentConfig;
    deploymentConf?[key] : e;
    setDtsVO({...dtsVO, deploymentConfig: deploymentConf})
  }

  function saveDtsVO() {
    const configParameters: ConfigurationParameters = {
      headers: {
        'Authorization': 'Bearer ' + auth.user?.access_token ,
        
      },
      basePath: 'http://localhost:2601/',
    };
    
  
    const config = new Configuration(configParameters);
    const api = new DtsResourceApi(config);
    
   
    
    api.dtsSavePost({ dtsVO: dtsVO });
  
    
  }
  
  
   
  useEffect(() => {
    console.log("going here " + auth.isAuthenticated);
    if (auth.isAuthenticated) {
      
      getDtsVO();
    }
    

  }, [auth, dtsTemplateVOs]);

  if (auth.isAuthenticated) {
    

    return (
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                { dtsVO?.name }
              </h3>
            </div>
            <form action="">
              <div className="p-6.5">
                
                 
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Name
                  </label>
                  <input
                    type="text"
                    placeholder="Choose a name for your DTS"
                    value={dtsVO?.name}
                    onChange={(e) => {
                      setDtsVO({...dtsVO, name: e.target.value})
                    }}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {/* onChange​= {(e) => setDtsVO({...dtsVO, name: e.target.value})}  */}
                </div>
                <div className="mb-4.5">
      <label className="mb-2.5 block text-black dark:text-white">
        {" "}
        DTS Template{" "}
      </label>

      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          value={dtsVO?.templateFk}
          
          onChange={(e) => {
            setDtsVO({...dtsVO, templateFk: e.target.value})
            changeTextColor();
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
        >

          <option value="newTemplateFk" disabled className="text-body dark:text-bodydark">
            Select your template
          </option>

      {dtsTemplateVOs.map((dtst, index) => (
             
            <option value={dtst.id} className="text-body dark:text-bodydark">
              {dtst.name}
            </option>
            
            ))}




        </select>

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>



            
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                DTS Configuration
                </label>
                <textarea
                  rows={6}
                  placeholder="Write your DTS Configuration"
                  value={dtsVO?.config}
                  onChange={(e) => {
                    setDtsVO({...dtsVO, config: e.target.value})
                  }}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
                     
                  </div>

                  <div>
                  <label
                    htmlFor="checkboxLabelTwo"
                    className="flex cursor-pointer select-none items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id="checkboxLabelTwo"
                        className="sr-only"
                        onChange={() => {
                          setDtsVO({...dtsVO, debug: !dtsVO?.debug});
                        }}
                      />
                      <div
                        className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                          dtsVO?.debug && "border-primary bg-gray dark:bg-transparent"
                        }`}
                      >
                        <span className={`opacity-0 ${dtsVO?.debug && "!opacity-100"}`}>
                          <svg
                            width="11"
                            height="8"
                            viewBox="0 0 11 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                              fill="#3056D3"
                              stroke="#3056D3"
                              strokeWidth="0.4"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    Debug
                  </label>
                </div>


 
                {getDeploymentConfigKeys().map((key) => (

                    <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    { key }
                    </label>
                    <input
                      type="text"
                      value={   
                        
                        dtsVO?.deploymentConfig[key]   }
                      onChange={(e) => {
                        
                        let deploymentConf = dtsVO?.deploymentConfig;
                        deploymentConf?[key] : e;
                        setDtsVO({...dtsVO, deploymentConfig: deploymentConf})
                        console.log(dtsVO?.deploymentConfig[key])
                      }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                 ))}
               
                
              </div>
            </form>
            <button onClick={saveDtsVO} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                  Save
                </button>
          </div>
        </div>


      
    </div>
    );
  } else {
    return (
      <div>
       You are not authenticated.
      </div>
    );
  }

  
}




export default DtsViewEdit;