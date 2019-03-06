import React from 'react';

export default class extends React.Component {
    static getInitialProps({res, err}) {
        return {statusCode: res ? res.statusCode : err ? err.statusCode : null};
    }

    constructor(props) {
        super(props);
        if (!props.statusCode) return;
        switch (props.statusCode) {
            case 404:
                this.render = this.render404;
                break;
            case 500:
                this.render = this.render500;
                break;
            default:
                this.render = this.renderError;
                break;
        }
    }

    render404 = () => <p>404</p>;
    render500 = () => <p>500</p>;
    renderError = () => <p>An error ${this.props.statusCode} occurred on server</p>;

    render() {
        return <p>An error occurred on client</p>;
    }
}
