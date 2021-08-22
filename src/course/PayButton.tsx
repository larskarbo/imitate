import { loadStripe } from "@stripe/stripe-js/pure";
import axios from "axios";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { getErrorMessage } from "../app/utils/getErrorMessage";
import { BASE } from "../app/utils/request";

export default function PayButton() {
  const [loadingPay, setLoadingPay] = useState(false);
  const onPressPay = () => {
    setLoadingPay(true);
    axios
      .post(BASE + "/money/checkout")
      .then(async function ({ data }) {
        const stripe = await loadStripe(process.env.GATSBY_STRIPE_PUB_KEY);
        stripe
          .redirectToCheckout({
            sessionId: data.sessionId,
          })
          .then((res) => {});
      })
      .catch(function (error) {
        console.log("getErrorMessage(error): ", getErrorMessage(error));
      });
  };

  return (
    <button
      onClick={onPressPay}
      className="flex items-center my-4 px-6 py-3 font-medium text-lg bg-green-500 text-white hover:bg-green-200 border border-gray-400 hover:border-gray-500 shadow-sm rounded transition-colors"
    >
      {loadingPay && <FaSpinner className="animate-spin mr-2" />} Get access (25$)
    </button>
  );
}
