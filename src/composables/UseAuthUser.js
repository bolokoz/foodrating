import { ref } from 'vue';
import useSupabase from '../boot/supabase';
import { useUserStore } from '../stores/userConfig';
const user = ref(null);

export default function useAuthUser() {
  const { supabase } = useSupabase();
  const store = useUserStore();

  const login = async ({ email, password }) => {
    store.$reset();
    const { user, error } = await supabase.auth.signIn({ email, password });
    // const extraInfo = await getUserInfo(user.id);
    // store.user = { ...user, ...extraInfo[0] };
    if (error) throw error;
    return error;
  };

  const getUserInfo = async (id) => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', id);
    if (error) throw error;
    return data;
  };

  const loginWithSocialProvider = async (provider) => {
    const { user, error } = await supabase.auth.loginWithSocialProvider({
      provider,
    });
    if (error) throw error;
    return error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const isLoggedIn = () => {
    return !!user.value;
  };

  const register = async ({ email, password, ...meta }) => {
    const { user, error } = await supabase.auth.signUp(
      { email, password },
      {
        data: meta,
        redirectTo: `${window.location.origin}/home?fromEmail=registrationConfirmation`,
      }
    );
    if (error) throw error;
    return user;
  };

  const update = async (data) => {
    const { user, error } = await supabase.auth.update(data);
    if (error) throw error;
    return user;
  };

  const sendPasswordResetEmail = async (email) => {
    const { user, error } = await supabase.auth.api.resetPasswordForEmail(
      email
    );
    if (error) throw error;
    return user;
  };

  const resetPassword = async (accessToken, newPassword) => {
    const { user, error } = await supabase.auth.api.updateUser(accessToken, {
      password: newPassword,
    });
    if (error) throw error;
    return user;
  };

  return {
    user,
    login,
    loginWithSocialProvider,
    logout,
    isLoggedIn,
    register,
    update,
    sendPasswordResetEmail,
    resetPassword,
  };
}
