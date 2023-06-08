import {PixelRatio, View, Text} from "react-native";
import { GLView } from "expo-gl";
import Expo2DContext from "expo-2d-context";
import React from "react";
import Styling from "./styling";

const X_SIZE = 300;
const Y_SIZE = 300;
const MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31];
const COLORS = ["red","green","blue","yellow","orange","purple","brown", "black", "violet","gray", "pink", "lime"]
export default class Graph extends React.Component {
    render() {
        return (<View>
            <GLView
                style = {{
                    width: X_SIZE,
                    height: Y_SIZE,
                    borderColor:"black",
                    borderWidth:2
                }}
                onContextCreate={this._saveContext}
                onLayout = {this._updateSize}
            />
            {this.state.failedGraph &&
                <Text style = {Styling.styleSheet.text}>
                    Failed to load the graph, this is due to limitations in the Android emulator. Please load this project in a physical Android device to display the graph.
                </Text>
            }
        </View>);
    }

    state = {failedGraph : false};
    _context = null;
    _xScale = 1;
    _yScale = 1;

    _graphs = [];
    updateExpenses = (expenses, month) => {
        this._graphs = [];
        let totalDays = MONTH_DAYS[month%12];
        let keys = Object.keys(expenses);
        let maxAmount = 0;
        for (let i = 0; i < keys.length; i++) {
            let graph = {
                name:expenses[keys[i]].budget.CatName,
            }
            graph.color = Graph.getCatColor(graph.name);
            graph.budget = expenses[keys[i]].budget.Amount;
            let expenseDays = {};
            for (let j = 0; j < expenses[keys[i]].expenses.length; j++) {
                let expense = expenses[keys[i]].expenses[j];
                expenseDays[expense.DayOfMonth] = 0;
            }
            for (let j = 0; j < expenses[keys[i]].expenses.length; j++) {
                let expense = expenses[keys[i]].expenses[j];
                expenseDays[expense.DayOfMonth] += expense.Amount;
            }
            let days = Object.keys(expenseDays);
            days.sort((a,b)=>Number(a)-Number(b));
            for (let j = 1; j < days.length; j++) {
                expenseDays[days[j]] += expenseDays[days[j-1]];
            };
            maxAmount = Math.max(maxAmount, expenseDays[days[days.length-1]]);
            maxAmount = Math.max(maxAmount, graph.budget);
            graph.points = [];
            for (let j = 0; j < days.length; j++) {
                graph.points.push(
                    {
                        x:days[j]/totalDays,
                        y:expenseDays[days[j]]
                    }
                );
            };
            this._graphs.push(graph);
        }
        for (let i = 0; i < this._graphs.length; i++) {
            for (let j = 0; j < this._graphs[i].points.length; j++) {
                this._graphs[i].points[j].y /= maxAmount;
            }
            this._graphs[i].budget /= maxAmount;
        }
        this._updateDrawing();
    };

    _saveContext = (gl) => {
        try {
            this._context = new Expo2DContext(gl);
        } catch (err) {
            this.setState({failedGraph : true});
            return;
        }
        this._context.scale(this._xScale, this._yScale);
        this._updateDrawing();
    };

    _updateDrawing = () => {
        if (this._context == null) {
            return;
        }
        this._context.fillStyle = "white";
        this._context.fillRect(0,0,X_SIZE*this._xScale,Y_SIZE*this._yScale);
        for (let i = 0; i < this._graphs.length; i++) {
            let graph = this._graphs[i];
            this._context.strokeStyle = graph.color;
            this._context.beginPath();
            this._context.moveTo(
                graph.points[0].x * X_SIZE,
                Y_SIZE - graph.points[0].y * Y_SIZE
            );
            for (let j = 0; j < graph.points.length; j++) {
                this._context.lineTo(
                    graph.points[j].x * X_SIZE,
                    Y_SIZE - graph.points[j].y * Y_SIZE
                );
            }
            this._context.stroke();
            this._context.beginPath();
            let amountHeight = Y_SIZE - graph.budget * Y_SIZE;
            for (let j = 0; j < X_SIZE; j += 20) {
                this._context.moveTo(j, amountHeight);
                this._context.lineTo(j + 10, amountHeight);
            };
            this._context.stroke();
        };
        this._context.flush();
    }

    _updateSize = (layoutEvent) => {
        layoutEvent.target.measure((_x, _y, w, h, _px, _py) => {
            let pixelWidth = PixelRatio.getPixelSizeForLayoutSize(w);
            let pixelHeight = PixelRatio.getPixelSizeForLayoutSize(h);
            this._xScale = pixelWidth/X_SIZE;
            this._yScale = pixelHeight/Y_SIZE;
            if (this._context != null) {
                this._context.scale(this._xScale, this._yScale);
            }
        });
        this.props.getGraph(this);
    }

    //Couldn't find a reliable way to seed random, so made a very basic pseudo-random generator
    static getCatColor = (catName) => {
        let c = 1;
        for (let i = 0; i < catName.length; i++) {
            c *= catName.charCodeAt(i);
            c += catName.charCodeAt(i);
            c = c % COLORS.length;
        };
        return COLORS[c];
    };
}
