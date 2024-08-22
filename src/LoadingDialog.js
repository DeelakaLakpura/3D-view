import React from 'react';

const LoadingDialog = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
<dotlottie-player src="https://lottie.host/e6dfa1c4-df09-40a9-b4e5-bc7d1cbc69df/P805jVTYVS.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>
        <p className="text-center text-lg font-medium mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingDialog;