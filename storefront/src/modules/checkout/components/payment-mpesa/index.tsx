// import Alert from "@modules/common/icons/alert"

// const PaymentMPesa = () => {
//   return (
//     <div className="w-full">
//       <div className="flex items-center gap-x-2 bg-yellow-100 w-full p-2">
//         <Alert size={16} className="text-yellow-700" />
//         <span className="text-small-regular text-yellow-700">
//           <span className="font-semibold">Attention:</span> For testing purposes
//           only.
//         </span>
//       </div>
//     </div>
//   )
// }

// export default PaymentMPesa

const PaymentMPesa = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-x-2 bg-yellow-100 w-full p-2">
        {/* Alert component and other elements */}
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          M-Pesa Number:
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          required
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
        <small className="text-gray-500">Format: 123-456-7890</small>
      </div>
    </div>
  )
}

export default PaymentMPesa
