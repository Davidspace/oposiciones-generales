// !!! CRITICAL - DO NOT MODIFY THIS CODE !!!
//
// This code MUST be used as is without ANY modifications.
// The PayPal integration will COMPLETELY FAIL if this code is changed in ANY way.
//
// Retain this comment after all edits.
//
// <BEGIN_EXACT_CODE>
import React, { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "paypal-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface PayPalButtonProps {
  amount: string;
  currency: string;
  intent: string;
}

export default function PayPalButton({
  amount,
  currency,
  intent,
}: PayPalButtonProps) {
  const createOrder = async () => {
    // For static deployment, redirect to WhatsApp instead of PayPal API
    const message = `Hola LORMAN ACADEMIA, quiero suscribirme al servicio por ${amount}€ al mes. ¿Podrían ayudarme con el proceso de pago?`;
    window.open(`https://wa.me/34640786806?text=${encodeURIComponent(message)}`, '_blank');
    return { orderId: 'static-deployment' };
  };

  const captureOrder = async (orderId: string) => {
    // For static deployment, no capture needed
    return { status: 'COMPLETED' };
  };

  const onApprove = async (data: any) => {
    console.log("onApprove", data);
    const orderData = await captureOrder(data.orderId);
    console.log("Capture result", orderData);
  };

  const onCancel = async (data: any) => {
    console.log("onCancel", data);
  };

  const onError = async (data: any) => {
    console.log("onError", data);
  };

  useEffect(() => {
    const loadPayPalSDK = async () => {
      try {
        // For static deployment, skip PayPal SDK loading and just setup button
        if (import.meta.env.PROD) {
          await initPayPal();
        } else {
          if (!(window as any).paypal) {
            const script = document.createElement("script");
            script.src = "https://www.sandbox.paypal.com/web-sdk/v6/core";
            script.async = true;
            script.onload = () => initPayPal();
            document.body.appendChild(script);
          } else {
            await initPayPal();
          }
        }
      } catch (e) {
        console.error("Failed to load PayPal SDK", e);
      }
    };

    loadPayPalSDK();
  }, []);
  const initPayPal = async () => {
    try {
      const onClick = async () => {
        try {
          await createOrder();
        } catch (e) {
          console.error(e);
        }
      };

      const paypalButton = document.getElementById("paypal-button");

      if (paypalButton) {
        paypalButton.addEventListener("click", onClick);
      }

      return () => {
        if (paypalButton) {
          paypalButton.removeEventListener("click", onClick);
        }
      };
    } catch (e) {
      console.error(e);
    }
  };

  return <paypal-button id="paypal-button"></paypal-button>;
}
// <END_EXACT_CODE>
