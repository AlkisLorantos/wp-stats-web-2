// export function PageLoading() {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar skeleton */}
//       <div className="bg-gray-100 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
//           <div className="flex gap-4">
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//           </div>
//         </div>
//       </div>

//       {/* Content skeleton */}
//       <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
//         {/* Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//             <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
//             <div className="space-y-3">
//               <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
//               <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
//               <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
//             </div>
//           </div>
//           <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//             <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
//             <div className="space-y-3">
//               <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
//               <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
//               <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function TableLoading() {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar skeleton */}
//       <div className="bg-gray-100 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
//           <div className="flex gap-4">
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//           </div>
//         </div>
//       </div>

//       {/* Content skeleton */}
//       <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
//         {/* Form skeleton */}
//         <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//           <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
//           <div className="flex gap-4">
//             <div className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse" />
//             <div className="h-10 flex-1 bg-gray-200 rounded-lg animate-pulse" />
//             <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
//           </div>
//         </div>

//         {/* Table skeleton */}
//         <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//           <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
//           <div className="space-y-3">
//             <div className="h-10 bg-gray-200 rounded animate-pulse" />
//             <div className="h-12 bg-gray-100 rounded animate-pulse" />
//             <div className="h-12 bg-gray-100 rounded animate-pulse" />
//             <div className="h-12 bg-gray-100 rounded animate-pulse" />
//             <div className="h-12 bg-gray-100 rounded animate-pulse" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StatsLoading() {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar skeleton */}
//       <div className="bg-gray-100 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
//           <div className="flex gap-4">
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//             <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
//           </div>
//         </div>
//       </div>

//       {/* Content skeleton */}
//       <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
//         {/* Stats grid */}
//         <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//           <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
//                 <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-2" />
//                 <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Top performers */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//               <div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-4" />
//               <div className="space-y-2">
//                 {[...Array(5)].map((_, j) => (
//                   <div key={j} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export function GameLoading() {
//   return (
//     <div className="min-h-screen bg-gray-900">
//       {/* Header skeleton */}
//       <div className="bg-gray-800 border-b border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="h-6 w-16 bg-gray-700 rounded animate-pulse" />
//             <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
//           </div>
//           <div className="h-10 w-24 bg-gray-700 rounded animate-pulse" />
//           <div className="h-10 w-28 bg-gray-700 rounded animate-pulse" />
//         </div>
//       </div>

//       {/* Content skeleton */}
//       <div className="max-w-7xl mx-auto p-4 space-y-4">
//         <div className="bg-gray-800 rounded-xl p-6">
//           <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-4" />
//           <div className="grid grid-cols-7 gap-3">
//             {[...Array(14)].map((_, i) => (
//               <div key={i} className="h-24 bg-gray-700 rounded-lg animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export function PageLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar skeleton */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}