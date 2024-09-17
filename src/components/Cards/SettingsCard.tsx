'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SettingsEntity } from "@/entities/settings/_domain/types";
import { useDataFetcher } from '@/hooks/useDataFetcher';
import Loader from '../Common/Loader';
import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Divider, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, useDisclosure } from '@nextui-org/react';
import { useLogger } from '@/hooks/useLogger';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { useSaveData } from '@/hooks/useSaveData';


const SettingsDetailForm = () => {
    const [activeTab, setActiveTab] = useState('hard');
    const[settings, setSettings] = useState<SettingsEntity|null>(null);

    const [hardBannedIPs, setHardBannedIPs] = useState<string[]>([]);
    const [softBannedIPs, setSoftBannedIPs] = useState<string[]>([]);

    const [hardBannedEmails, setHardBannedEmails] = useState<string[]>([]);
    const [softBannedEmails, setSoftBannedEmails] = useState<string[]>([]);


    const [hardBannedDomains, setHardBannedDomains] = useState<string[]>([]);
    const [softBannedDomains, setSoftBannedDomains] = useState<string[]>([]);
    
    const [newHardIP, setNewHardIP] = useState({value: "", isValid: true});
    const [newHardEmail, setNewHardEmail] = useState({value: "", isValid: true});
    const [newHardDomain, setNewHardDomain] = useState({value: "", isValid: true});
    
    const [newSoftIP, setNewSoftIP] = useState({value: "", isValid: true});
    const [newSoftEmail, setNewSoftEmail] = useState({value: "", isValid: true});
    const [newSoftDomain, setNewSoftDomain] = useState({value: "", isValid: true});
    
    const {isSaving, errorSaving, saveData} = useSaveData(API_ENDPOINTS.SETTINGS);
    const isFirstRender = useRef(true); 
    //getting settings details
    const {data: settingsData, isLoading, error, total, fetchData } = useDataFetcher<SettingsEntity>();
    //getting function for posting logs
    const { logMessage } = useLogger();
    useEffect(() => {

      fetchData({
                endpoint:API_ENDPOINTS.SETTINGS,
                selectedFilterValue:{}});

          
    },[]);

    useEffect(() => {

      if (settingsData.length > 0) {
        setHardBannedIPs(settingsData[0].data.hard_banned_ips ? settingsData[0].data.hard_banned_ips : []);
        setSoftBannedIPs(settingsData[0].data.soft_banned_ips ? settingsData[0].data.soft_banned_ips : []);

        setHardBannedEmails(settingsData[0].data.hard_banned_emails ? settingsData[0].data.hard_banned_emails : []);
        setSoftBannedEmails(settingsData[0].data.soft_banned_emails ? settingsData[0].data.soft_banned_emails : []);
        
        setHardBannedDomains(settingsData[0].data.hard_banned_email_domains ? settingsData[0].data.hard_banned_email_domains : []);
        setSoftBannedDomains(settingsData[0].data.soft_banned_email_domains ?? []);

        setSettings(settingsData[0]);
      }
    }, [settingsData]);

    const saveSettings = async () => {

      if (!settings?.id) return;

      const updatedSettings = {
          ...settings.data
      };

      updatedSettings.hard_banned_ips = [...hardBannedIPs];
      updatedSettings.soft_banned_ips = [...softBannedIPs];
      updatedSettings.hard_banned_emails = [...hardBannedEmails];
      updatedSettings.soft_banned_emails = [...softBannedEmails];
      updatedSettings.hard_banned_email_domains = [...hardBannedDomains];
      updatedSettings.soft_banned_email_domains = [...softBannedDomains];

      await saveData(settings.id,  updatedSettings );
      logMessage('Settings updated successfully.');
  };

    useEffect(() => {
      if (isFirstRender.current) {

        isFirstRender.current = false; 
      }else{

        saveSettings();
      }
  
    }, [hardBannedIPs, hardBannedEmails, hardBannedDomains, softBannedIPs, softBannedEmails, softBannedDomains]); 

    if (error) {
      return <div>Error loading {error}</div>; 
    }

    if (!settings) {
    return null;
    }

    if (isLoading) {
      return <Loader /> ;
    } 
  

    const handleTabChange = (key: any) => {
      setActiveTab(key); 
    };

    const isValidIP = (ip: string): boolean => {
      if (!ip) { return true; }
    
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      return ipRegex.test(ip);
    };

    const isValidEmail = (email: string) => {
      if (!email){return true;}
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    const isValidDomain = (domain: string) => {

      if (!domain) { return true; }
      const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return domainRegex.test(domain);
    };


    const handleChangeIP = (ip: string)=>{
      switch (activeTab){
        case'hard':
          setNewHardIP({value:ip,isValid:isValidIP(ip)});
          break;
        case'soft':
          setNewSoftIP({value:ip,isValid:isValidIP(ip)});
          break;
      }  

    }

    const handleChangeEmail = (email: string)=>{
      switch (activeTab){
        case'hard':
          setNewHardEmail({value:email,isValid:isValidEmail(email)});
          break;
        case'soft':
          setNewSoftEmail({value:email,isValid:isValidEmail(email)});
          break;
      }  

    }

    const handleChangeDomain = (domain: string)=>{
      switch (activeTab){
        case'hard':
          setNewHardDomain({value:domain,isValid:isValidDomain(domain)});
          break;
        case'soft':
          setNewSoftDomain({value:domain,isValid:isValidDomain(domain)});
          break;
      }  

    }

      // Function to add new IP
  const handleAddIP = () => {
    switch (activeTab){
      case'hard':
                  if (newHardIP.value && newHardIP.isValid && !hardBannedIPs.includes(newHardIP.value)) {
                      setHardBannedIPs([...hardBannedIPs, newHardIP.value]);
                      setNewHardIP({value:"", isValid:true});

                      
                  }
                  break;
      case'soft':
                  if (newSoftIP && newSoftIP.isValid &&!softBannedIPs.includes(newSoftIP.value)) {
                      setSoftBannedIPs([...softBannedIPs, newSoftIP.value]);
                      setNewSoftIP({value:"", isValid:true});
                  }      
                  break;      

    }
  };

  const handleAddEmail = () => {
    switch (activeTab){
      case'hard':
                  if (newHardEmail && newHardEmail.isValid && !hardBannedEmails.includes(newHardEmail.value)) {
                      setHardBannedEmails([...hardBannedEmails, newHardEmail.value]);
                      setNewHardEmail({value:"", isValid:true});
                  }
                  break;
      case'soft':
                  if (newSoftEmail && newSoftEmail.isValid && !softBannedEmails.includes(newSoftEmail.value)) {
                      setSoftBannedEmails([...softBannedEmails, newSoftEmail.value]);
                      setNewSoftEmail({value:"", isValid:true});
                  }
                  break;            

    }
  };


  const handleAddDomain = () => {
    switch (activeTab){
      case'hard':
                  if (newHardDomain && newHardDomain.isValid && !hardBannedDomains.includes(newHardDomain.value)) {
                      setHardBannedDomains([...hardBannedDomains, newHardDomain.value]);
                      setNewHardDomain({value:"", isValid:true});
                  }
                  break;
      case'soft':
                  if (newSoftDomain && newSoftDomain.isValid && !softBannedDomains.includes(newSoftDomain.value)) {
                      setSoftBannedDomains([...softBannedDomains, newSoftDomain.value]);
                      setNewSoftDomain({value:"", isValid:true});
                  }   
                  break;         

    }
  };

  // Function to remove IP
  const handleRemoveIP = (ip:string) => {
    switch (activeTab){

      case'hard':
                  setHardBannedIPs(hardBannedIPs.filter((item) => item !== ip));
                  break;
      case'soft':
                  setSoftBannedIPs(softBannedIPs.filter((item) => item !== ip));
                  break;


    }
    
  };

  const handleRemoveEmail = (email:string) => {
    switch (activeTab){

      case'hard':
                  setHardBannedEmails(hardBannedEmails.filter((item) => item !== email));
                  break;
      case'soft':
                  setSoftBannedEmails(softBannedEmails.filter((item) => item !== email));
                  break;


    }
    
  };

  const handleRemoveDomain = (domain:string) => {
    switch (activeTab){

      case'hard':
                  setHardBannedDomains(hardBannedDomains.filter((item) => item !== domain));
                  break;
      case'soft':
                  setSoftBannedDomains(softBannedDomains.filter((item) => item !== domain));
                  break;


    }
    
  };

  

    const renderSettingsTable=(title: string, data: string[], handleRemoveRecord: (name: string) => void)=>{
            
    return(

      <Table>
      <TableHeader>
        <TableColumn>{title}</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      {data ? (<TableBody>
        {data.slice().reverse().map((name) => (
          <TableRow key={name}>
            <TableCell>{name}</TableCell>
            <TableCell>
              <Button color="danger" size="sm" onPress={() => {handleRemoveRecord(name)}}>
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>):
            <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>}
    </Table>
    );

    }
    // tabs rendering
    const renderTabContent = () => {
    switch (activeTab) {
        case 'hard':
        return (
          <Card>
  
          <CardBody>
            <Accordion>
              <AccordionItem key="1" aria-label="ips" title={`IP Adresses (${hardBannedIPs.length})`}>
                <div className="mb-4 flex gap-4">
                  <Input
                    placeholder="Enter IP address"
                    fullWidth
                    value={newHardIP.value}
                    isInvalid={!newHardIP.isValid}
                    onChange={(e) => handleChangeIP(e.target.value)}
                    
                  />
                  <Button 
                    isDisabled={!newHardIP.isValid||newHardIP.value.length === 0}
                    onPress={handleAddIP}>
                    Add
                  </Button>
                </div>
                
                {renderSettingsTable("IP Adresses", hardBannedIPs, handleRemoveIP)}
              </AccordionItem>
              <AccordionItem key="2" aria-label="emails" title={`E-mails (${hardBannedEmails.length})`}>
                <div className="mb-4 flex gap-4">
                  <Input
                    placeholder="Enter E-mail"
                    fullWidth
                    value={newHardEmail.value}
                    isInvalid={!newHardEmail.isValid}
                    onChange={(e) => handleChangeEmail(e.target.value)}
                  />
                  <Button 
                    isDisabled={!newHardEmail.isValid||newHardEmail.value.length === 0}
                    onPress={handleAddEmail}>
                    Add
                  </Button>
                </div>
              
                {renderSettingsTable("E-mails", hardBannedEmails, handleRemoveEmail)}
              </AccordionItem>
              <AccordionItem key="3" aria-label="domains" title={`Domains (${hardBannedDomains.length})`}>
                <div className="mb-4 flex gap-4">
                  <Input
                    placeholder="Enter Domain"
                    fullWidth
                    value={newHardDomain.value}
                    isInvalid={!newHardDomain.isValid}
                    onChange={(e) => handleChangeDomain(e.target.value)}
                  />
                  <Button 
                    isDisabled={!newHardDomain.isValid||newHardDomain.value.length === 0}
                    onPress={handleAddDomain}>
                    Add
                  </Button>
                </div>
              
                {renderSettingsTable("Domains", hardBannedDomains, handleRemoveDomain)}
              </AccordionItem>
            </Accordion>

          </CardBody>
        </Card>
      );
        
        case 'soft':
        return (

          <Card>
  
          <CardBody>
            <Accordion>
              <AccordionItem key="1" aria-label="ips" title={`IP Adresses (${softBannedEmails.length})`}>
                <div className="mb-4 flex gap-4">
                  <Input
                    placeholder="Enter IP address"
                    fullWidth
                    value={newSoftIP.value}
                    isInvalid={!newSoftIP.isValid}
                    onChange={(e) => handleChangeIP(e.target.value)}
                  
                  />
                  <Button 

                    isDisabled={!newSoftIP.isValid||newSoftIP.value.length === 0}
                    onPress={handleAddIP}>
                    Add
                  </Button>
                </div>
                
                {renderSettingsTable("IP Adresses", softBannedIPs, handleRemoveIP)}
              </AccordionItem>

              <AccordionItem key="2" aria-label="emails" title={`E-mails (${softBannedEmails.length})`}>
                <div className="mb-4 flex gap-4">
                  <Input
                    placeholder="Enter E-mail"
                    fullWidth
                    value={newSoftEmail.value}
                    isInvalid={!newSoftEmail.isValid}
                    onChange={(e) => handleChangeEmail(e.target.value)}
                  />
                  <Button 
                    isDisabled={!newSoftEmail.isValid||newSoftEmail.value.length === 0}
                    onPress={handleAddEmail}
                  >
                    Add
                  </Button>
                </div>
              
                {renderSettingsTable("E-mails", softBannedEmails, handleRemoveEmail)}
              </AccordionItem>
              <AccordionItem key="3" aria-label="domains" title={`Domains (${softBannedDomains.length})`}>
                <div className="mb-4 flex gap-4">
                  <Input
                    placeholder="Enter Domain"
                    fullWidth
                    isInvalid={!newSoftDomain.isValid}
                    value={newSoftDomain.value}
                    onChange={(e) => handleChangeDomain(e.target.value)}
                  />
                  <Button 

                    isDisabled={!newSoftDomain.isValid||newSoftDomain.value.length === 0}
                    onPress={handleAddDomain}
                  >
                    Add
                  </Button>
                </div>
              
                {renderSettingsTable("Domains", softBannedDomains, handleRemoveDomain)}
              </AccordionItem>


            </Accordion>

          </CardBody>
        </Card> 
        );
        default:
        return null;
    }
};

  return (

    <Card className="w-full min-w-[600px]">
      <CardHeader className="flex gap-3"> 
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Global Settings</p>
        </div>

      </CardHeader>
      <Divider />
      <Tabs aria-label="Options"
            onSelectionChange={handleTabChange}
            className='mt-2'
      >
        <Tab key="hard" title="Hard Banned">
          <Card>
            <CardBody className="h-screen">
              {renderTabContent()}
            </CardBody>
          </Card>  
        </Tab>
        <Tab key="soft" title="Soft Banned">
          <Card>
            <CardBody className="h-screen">
              {renderTabContent()}
            </CardBody>
          </Card>  
        </Tab>
      </Tabs>
    </Card>

  );
};

export default SettingsDetailForm;
