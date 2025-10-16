import NavbarOwner from '../../components/owner/NavbarOwner'


const Layout = () => {
  return (
    <div className='flex flex-col'>
      <NavbarOwner />
      <div className='flex'></div>
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default Layout

