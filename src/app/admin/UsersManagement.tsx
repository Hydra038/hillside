import dynamic from "next/dynamic";
const UsersManagement = dynamic(() => import("./users/page"), { ssr: false });
export default UsersManagement;
