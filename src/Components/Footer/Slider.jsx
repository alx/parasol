import React from 'react'

class Slider extends React.Component {

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.dates[0] != this.props.dates[0]) || (nextProps.dates[nextProps.dates.length - 1] != this.props.dates[this.props.dates.length - 1])) {
            this.forceUpdate();
        }
    }

    handleSliderChange(e) {
        console.log("ok");
    }

    render() {

        return (
            <div />
        )
    }
}

export default Slider
