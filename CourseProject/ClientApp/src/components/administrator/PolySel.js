import React, { Component } from 'react';
import './PolySel.css';

export class PolySel extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                Hello, i'm SelPolyPage!
            </div>
        );
    }
}

export default PolySel;

// dotnet ef dbcontext scaffold "Data Source=DESKTOP-IHVPCAN\\POLYCLINICS;Initial Catalog=QUEUEDB;Integrated Security=True;Connect Timeout=30;Encrypt=False;Trust Server Certificate=False;Application Intent=ReadWrite;Multi Subnet Failover=False;" "Microsoft.EntityFrameworkCore.SqlServer" -o Model --force