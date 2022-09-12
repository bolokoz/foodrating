import useSupabase from 'src/boot/supabase';
import useAuthUser from './UseAuthUser';

import { v4 as uuidv4 } from 'uuid';

export default function useApi() {
  const { supabase } = useSupabase();
  const { user } = useAuthUser();

  const projectById = async (projectId) => {
    const { data, error } = await supabase
      .from('project')
      .select('*')
      .eq('id', projectId);
    if (error) throw error;
    return data[0];
  };

  const list = async (table, order = 'id') => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order(order, { ascending: false });
    if (error) throw error;
    return data;
  };

  const listByColumn = async (table, columnFilter = '', filter = '') => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(column, filter);
    if (error) throw error;
    return data;
  };

  const listUniqueFromColumn = async (table, column) => {
    const { data, error } = await supabase.from(table).select(column);
    // console.log('list unique', data, error);
    if (error) throw error;
    // return [...new Set(data.forEach((d) => d.tipo))];
    // console.log(data);
    return data;
  };

  const listPublic = async (table, userId, columnFilter = '', filter = '') => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', userId)
      .eq(columnFilter, filter);
    if (error) throw error;
    return data;
  };

  const getById = async (table, id) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id);
    if (error) throw error;
    return data[0];
  };
  const post = async (table, form) => {
    const { data, error } = await supabase.from(table).insert([{ ...form }]);
    if (error) throw error;
    return data;
  };

  const simplePost = async (table, form) => {
    const { data, error } = await supabase.from(table).insert([{ ...form }]);
    if (error) throw error;
    return data;
  };

  const update = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ id: form.id });
    if (error) throw error;
    return data;
  };
  const simpleUpdate = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ id: form.id });
    if (error) throw error;
    return data;
  };
  const remove = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ id: id });
    if (error) throw error;
    return data;
  };

  const rpc = async (rpcName) => {
    console.log('rpc', rpcName);
    const { data, error } = await supabase.rpc(rpcName);
    if (error) throw error;
    return data;
  };

  const uploadImg = async (file, storage) => {
    // console.log('API uploadimg, file = ', file);
    // console.log('API uploadimg, file extension = ', file?.name?.split('.'));
    const fileExtension = file?.name?.split('.').pop();
    const fileName = uuidv4() + '.' + fileExtension;
    const { data, error } = await supabase.storage
      .from(storage)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
    console.log('after upload', data);
    const publicUrl = await getUrlPublic(fileName, storage);
    if (error) throw error;
    return publicUrl;
  };
  const removeFile = async (filename, storage) => {
    const { data, error } = await supabase.storage
      .from(storage)
      .remove(filename);
    if (error) throw error;
    return data;
  };
  const moveFileToTrash = async (filename, storage) => {
    // const { data, error } = supabase.storage
    //   .from(storage)
    //   .move(filename, 'trash/' + filename);
    // await supabase.storage.from('receipt').list();
    // const { data, error } = await supabase.storage
    //   .from('receipt')
    //   .remove(['ef7f5ef3-5f8b-47de-9fed-2005c654029a']);
    const { publicURL, error } = supabase.storage
      .from(storage)
      .getPublicUrl(filename);
    console.log(publicURL);
    if (error) throw error;
    return data;
  };

  const getUrlPublic = async (fileName, storage) => {
    const { publicURL, error } = supabase.storage
      .from(storage)
      .getPublicUrl(fileName);
    if (error) throw error;
    return publicURL;
  };
  const getAccountsFromProject = async (projectId) => {
    const { data, error } = await supabase
      .from('project')
      .select('accounts')
      .eq('id', projectId);

    let result = [];
    for (
      let index = 0;
      index < Object.values(data[0].accounts).length;
      index++
    ) {
      result.push(
        await getById('account', Object.values(data[0].accounts)[index])
      );
    }
    if (error) throw error;
    return result;
  };

  return {
    list,
    getById,
    listPublic,
    post,
    update,
    remove,
    getUrlPublic,
    uploadImg,
    supabase,
    simplePost,
    simpleUpdate,
    removeFile,
    listByColumn,
    listUniqueFromColumn,
    moveFileToTrash,
    getAccountsFromProject,
    projectById,
    rpc,
  };
}
