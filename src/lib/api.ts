import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { redirect } from 'next/navigation';
import config from '@/config';

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = '';
    const { toast } = useToast();

    if (error.response?.status === 401) {
      // User not auth, ask to re login
      toast({
        title: 'Unauthorized',
        description: 'Please login',
      });
      // Sends the user to the login page
      redirect(config.auth.loginUrl);
    } else if (error.response?.status === 403) {
      // User not authorized, must subscribe/purchase/pick a plan
      message = 'Pick a plan to use this feature';
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === 'string' ? message : JSON.stringify(message);

    console.error(error.message);

    // Automatically display errors to the user
    if (error.message) {
      toast({
        title: 'An Error Occurred',
        description: `${error.message}`,
      });
    } else {
      toast({
        title: 'An Error Occurred',
        description: 'something went wrong',
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
