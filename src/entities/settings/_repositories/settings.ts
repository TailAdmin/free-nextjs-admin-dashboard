import { dbClient } from "@/shared/lib/db";
import { SettingsEntity } from "../_domain/types";
import { convertDateStringToTimeStampInSeconds, convertTimeStampToLocaleDateString } from "@/shared/utils/commonUtils";
import logger from "@/shared/utils/logger";

export class SettingsRepository {



    mapToSettingsType = (data: any): SettingsEntity =>{

        const settingsData = {

            id: data.id,
            data: data.data,
            modified_at: convertTimeStampToLocaleDateString(data.modified_at),
  
        }


        return settingsData
    }
    async getSettings(): Promise<SettingsEntity> {
        try{
            
            
            const rawData = await dbClient.aghanim_global_settings.findFirst();

            const mappedData = this.mapToSettingsType(rawData);
      
            return mappedData;
        }    catch(error: unknown)  {


            if (error instanceof Error){
                logger.error({
                        msg: `Settings Repository Error. Failed to retrieve Settings`, 
                        error: error.message,
                        stack: error.stack,
                    }
                );
            } else{

                logger.error({msg: 'Settings Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to retrieve Settings`);


        }
    }

    async updateSettings(settingsId:string, data:  Record<string, any>): Promise<SettingsEntity>{
 
        try{
             await dbClient.aghanim_global_settings.update({
                                        where: {id: settingsId},
                                        data: {
                                                data: data,
                                                modified_at: Math.ceil(new Date().getTime()/1000)
                                                }  
                                        })
            return this.getSettings();
        } catch(error: unknown)
        {

            if (error instanceof Error){
                logger.error(
                    {msg: `Settings Repository Error. Failed to update settings data`, 
                    error: error.message,
                    stack: error.stack,
                });
            } else{

                logger.error({msg: 'Settings Repository Error. An unknown error occurred'});
            }    
            
            throw new Error(`Failed to update settings data`);
        }                                
    }
    
}

export const settingsRepository = new SettingsRepository();