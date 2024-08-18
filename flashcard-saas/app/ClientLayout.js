'use client';

//
// export default function ClientLayout({children}) {
//   const pathname = usePathname();
//   const router = useRouter();
//
//   const isHomePage = pathname === '/';
//
//   return (
//       <>
//         {!isHomePage && (
//             <Button
//                 startIcon={<ArrowBackIcon/>}
//                 onClick={() => router.back()}
//                 sx={{
//                   position: 'fixed',
//                   top: 16,
//                   left: 16,
//                   zIndex: 1000,
//                   color: 'white',
//                   backgroundColor: 'rgba(0, 0, 0, 0.6)',
//                   '&:hover': {
//                     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                   },
//                 }}
//             >
//               Back
//             </Button>
//         )}
//         {children}
//       </>
//   );
// }
