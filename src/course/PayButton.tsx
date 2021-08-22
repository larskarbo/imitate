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
      className="flex mb-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 border border-gray-400 hover:border-gray-500 shadow-sm text-sm rounded transition-colors"
    >
      {loadingPay && <FaSpinner className="animate-spin mr-2" />} Get access (24$)
    </button>
  );
}
