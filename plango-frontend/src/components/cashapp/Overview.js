import React from "react"

function Overview () {
  return (
    <div className="flex flex-row border-solid">
        <div className="p-5 flex flex-col text-center">
            <h1>Fixe Ausgaben:</h1>
            <div>420€</div>
        </div>
        <div className="p-5 border-black">
            <div className="border p-5 flex flex-col text-center">
                <h1>Fixe Einnahmen:</h1>
                <div>16969€</div>
            </div>
        </div>
        <div className="self-end border-solid p-5 border-black">Statistiken -</div>
    </div>
  )
};

export default Overview;
