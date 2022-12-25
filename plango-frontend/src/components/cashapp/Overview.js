import React, { Component } from "react"
import { BsFillPieChartFill, BsArrowBarRight } from "react-icons/bs"
import {Link} from "react-router-dom"

//Models:
import m_FixIncome from "../../utils/models/m_FixIncome";
import m_FixOutcome from "../../utils/models/m_FixOutcome";

export default class Overview extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      // Models:
      FixOutcome: new m_FixOutcome(),
      FixIncome: new m_FixIncome(),
      loading: false
    }
  }

  async componentDidMount() {
    // Initializing -> load data
    try {
      this.setState({loading: true})
      await this.state.FixIncome.m_FixIncome_FindAll()
      await this.state.FixOutcome.m_FixOutcome_FindAll()
    } catch (err) {
      console.log(err)
    } finally {
      this.setState({loading: false})
    }
  }
  
  render() {
    return (
      <div className="flex flex-row border-solid">
        <div className="p-5 border-black ">
          <div className="border p-5 flex flex-col text-center rounded-md bg-red-400">
              <h1>Fixe Ausgaben:</h1>
              <div className="font-bold">{this.state.FixOutcome.m_FixOutcome_Sum()}</div>
          </div>
        </div>
        <div className="p-5 border-black">
            <div className="border p-5 flex flex-col text-center rounded-md bg-green-400">
                <h1>Fixe Einnahmen:</h1>
                <div className="font-bold">{this.state.FixIncome.m_FixIncome_Sum()}</div>
            </div>
        </div>
        <Link to="statistik" className="p-5 border-black">
            <div className="border p-5 flex flex-col text-center rounded-md">
                <div className="flex flex-row items-center"><h1>Statistiken </h1><BsArrowBarRight size={20}/></div>
                <div className="mx-auto"><BsFillPieChartFill size={25}/></div>
            </div>
        </Link>
        <div className="p-5 border-black">
          <div className="border p-5 flex-col text-center rounded-md">
            <h1>Restbudget pro Tag:</h1>
            <div className="font-bold">{this.props.budget}</div>
          </div>
        </div>
      </div>
    )
  }
}


