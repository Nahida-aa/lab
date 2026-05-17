// server api
import { cache } from 'react'
import { serverAuth } from '@/lib/auth/server';
// import { getProject, listUserProject, statUserProject } from "@/api/project/service";
// import { listProjectMember } from '@/api/project/service/member';
// import { getUserByName } from '@/api/user/service';
// import { _getFriend } from '@/api/friend/service';

// Warning: cache 仅用于 get 
const sApi = {
  getSession: cache(serverAuth),
  // getUserByName: cache(getUserByName),
  // _getFriend: cache(_getFriend),
  // listUserProject: cache(listUserProject),
  // statUserProject: cache(statUserProject),
  // getProject: cache(getProject),
  // listProjectMember: cache(listProjectMember)
}
export default sApi