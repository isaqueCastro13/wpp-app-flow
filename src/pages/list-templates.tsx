import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

import { Link } from "react-router-dom";
import api from "../services/api";
import { Oval } from "react-loader-spinner";

export default function TemplatesList() {
  const FlowItem = ({ title, active, triggers, id }: any) => {
    return (
      // tailwind class name group to make a responsive card grid

      <div className="max-w-sm h-[270px] w-[320px] mr-3 flex flex-col justify-between mb-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="top">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
          <h3 className="mb-2 text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Gatilhos:
          </h3>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {triggers.map((trigger: any) => (
              <span className="bg-blue-100 inline-block text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {trigger.term}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-row items-center">
          <Link
            to={`/flows/${id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Editar
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </Link>

          <label className="relative ml-4 inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={active}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {active ? "Ativo" : "Inativo"}
            </span>
          </label>
        </div>
      </div>
    );
  };

  const [qrCode, setQrCode] = useState<string | null>(null);

  const [connected, setConnected] = useState(false);

  const [instance, setInstance] = useState<any>(null);

  const [flows, setFlows] = useState<any>([]);

  useEffect(() => {
    async function load() {
      setQrCode(null);

      const response1 = await api.get(
        "/users/641428ac4c89cd28836b09fa/wpp-status"
      );

      const { data: flowsData } = await api.get("/templates");

      if (flowsData && flowsData.length > 0) {
        setFlows(flowsData);
      }

      if (response1.data.connected) {
        setQrCode(null);
        setInstance(response1.data.instance);
        setConnected(true);
        return null;
      }

      const response = await api.get(
        "/users/641428ac4c89cd28836b09fa/wpp-connect"
      );
      if (!response1.data.connected) {
        setTimeout(async () => {
          const response2 = await api.get(
            "/users/641428ac4c89cd28836b09fa/qr-code"
          );
          if (response2.data.qrcode) {
            setQrCode(response2.data.qrcode);
          }
        }, 3000);
      }
    }

    load();
  }, []);

  return (
    <>
      <NavBar />

      <div className="content p-20">
        <div className="header mb-10 flex flex-col items-start justify-between ">
          <h1 className="text-3xl  font-bold">
            Conexão com celular{" "}
            {connected ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                Online
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                Requer conexão
              </span>
            )}
          </h1>
          {connected && instance && (
            <div className="flex items-center flex-row">
              <span className="text-2xl mt-3 mr-2 mb-10 font-semibold">
                {instance.user.id.split(":")[0]}
              </span>
              <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Desconectar
              </button>
            </div>
          )}
          {!connected &&
            (qrCode ? (
              <div className="flex mt-10 flex-row items-center">
                <div className="w-[180px] flex h-[180px]  rounded-md bg-gray-100">
                  {qrCode && (
                    <img src={qrCode} className=" rounded-md" alt="qr" />
                  )}
                </div>
                <ul className="ml-5"></ul>
              </div>
            ) : (
              <Oval
                height={80}
                width={80}
                color="blue"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="blue"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ))}
        </div>
        <div className="header flex justify-between items-center">
          <h1 className="text-5xl mb-10 font-bold">Fluxos</h1>
          <Link
            to="/flows/new"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Criar novo
          </Link>
        </div>
        <div className="flow-list flex flex-row justify-start align-middle text-left items-start">
          {flows.map((flow: any) => (
            <FlowItem
              active={flow.active}
              id={flow._id}
              title={flow.name}
              triggers={flow.trigger}
            ></FlowItem>
          ))}
        </div>
      </div>
    </>
  );
}
