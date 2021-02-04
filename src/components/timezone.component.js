import React, { PureComponent } from 'react'
import axios from 'axios';
import urls from '../Constants/urls'

export class Timezone extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            zones : [],
            selectedValue: '',
            selectedTime: '',
            loading: false
        }
        this.selectTimeZone = this.selectTimeZone.bind(this);
        this.callSelectedTime = this.callSelectedTime.bind(this)
    }

    clearInterval = '';

    selectTimeZone (event) {
        this.setState({
            selectedValue : event.target.value
        }, ()=>{
            this.callSelectedTime(this.state.selectedValue)
        })
    }

    async callSelectedTime (zone) {
        const selectedZone = await axios.get(`${urls.SPECIFICZONE}${zone}`);
        this.setState({
            selectedTime: selectedZone.data.formatted
        })
    }
    
    fetchData = async () => {
        const data = await axios.get(`${urls.ZONES}`)
        this.setState({
            zones : data.data.zones,
            loading: true
        },()=>{
            this.setState({
                selectedValue: this.state.zones[0].zoneName
            })
        })
        this.clearInterval = setInterval(()=>{
            this.callSelectedTime(this.state.selectedValue)
        },5000)
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        clearInterval(this.clearInterval);
    }
    
    render() {
        return (<>
        {!this.state.loading?<h2>Loading Time Zones...</h2>:
            <div>
                <select style={{width:'200px'}} onChange={this.selectTimeZone} value={this.state.selectedValue}>
                    {
                        this.state.zones.map((zone,index) => <option key={index} >{zone.zoneName}</option>)
                    }
                </select><br/>
                <h2>Selected Zone and Current time</h2>
                <div><b>Zone : </b>{this.state.selectedValue}</div> <b>Time : </b>{this.state.selectedTime}

                <h5><u>Note:</u> Selected zone time will be updated every 5'sec</h5>
            </div>
        }
            </>
        )
    }
}

export default Timezone
