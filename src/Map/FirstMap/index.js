import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import * as actionCreators from '../../Action/store/actionCreators'
import Map from "../../Base/Map"
import M1 from "../../Base/M1"
import Empty from "../../Base/Empty"
import './style.css'
import '../base.css'

class FirstMap extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    componentWillMount(){
        
    }

    render(){
        return(
            <Fragment>
                <Map areaList={this.returnAreaList()} id='currentMap'/>
            </Fragment>
        )
    }

    returnAreaList(){
        let areaList = [
            <M1 id='0' />, <M1 id='1' />, <M1 id='2' />, <M1 id='3' />, <M1 id='4' />, <M1 id='5' />, <M1 id='6' />, <M1 id='7' />, <M1 id='8' />, <M1 id='9' />, <M1 id='10' />, <M1 id='11' />, <M1 id='12' />, <M1 id='13' />, <M1 id='14' />, <M1 id='15' />, <M1 id='16' />, <M1 id='17' />, <M1 id='18' />, <M1 id='19' />, 
            <Empty location='up' id='20' />, <Empty id='21' />, <Empty id='22' />, <Empty id='23' />, <Empty id='24' />, <Empty id='25' />, <Empty id='26' />, <Empty id='27' />, <Empty id='28' />, <Empty id='29' />, <Empty id='30' />, <Empty id='31' />, <Empty id='32' />, <Empty id='33' />, <M1 id='34' />, <M1 id='35' />, <M1 id='36' />, <M1 id='37' />, <M1 id='38' />, <M1 id='39' />, 
            <M1 id='40' />, <M1 id='41' />, <M1 id='42' />, <M1 id='43' />, <M1 id='44' />, <M1 id='45' />, <M1 id='46' />, <M1 id='47' />, <M1 id='48' />, <M1 id='49' />, <M1 id='50' />, <M1 id='51' />, <M1 id='52' />, <Empty id='53' />, <M1 id='54' />, <M1 id='55' />, <M1 id='56' />, <M1 id='57' />, <M1 id='58' />, <M1 id='59' />, 
            <Empty id='60' />, <Empty id='61' />, <Empty id='62' />, <Empty id='63' />, <Empty id='64' />, <Empty id='65' />, <Empty id='66' />, <Empty id='67' />, <M1 id='68' />, <M1 id='69' />, <M1 id='70' />, <M1 id='71' />, <M1 id='72' />, <Empty id='73' />, <M1 id='74' />, <M1 id='75' />, <M1 id='76' />, <M1 id='77' />, <M1 id='78' />, <M1 id='79' />, 
            <Empty id='80' />, <Empty id='81' />, <Empty id='82' />, <M1 id='83' />, <M1 id='84' />, <M1 id='85' />, <Empty id='86' />, <M1 id='87' />, <Empty id='88' />, <Empty id='89' />, <Empty id='90' />, <M1 id='91' />, <M1 id='92' />, <Empty id='93' />, <M1 id='94' />, <M1 id='95' />, <M1 id='96' />, <M1 id='97' />, <M1 id='98' />, <M1 id='99' />, 
            <Empty id='100' />, <Empty id='101' />, <Empty id='102' />, <M1 id='103' />, <M1 id='104' />, <M1 id='105' />, <Empty id='106' />, <M1 id='107' />, <Empty id='108' />, <Empty id='109' />, <Empty id='110' />, <M1 id='111' />, <M1 id='112' />, <Empty id='113' />, <M1 id='114' />, <M1 id='115' />, <M1 id='116' />, <M1 id='117' />, <M1 id='118' />, <M1 id='119' />, 
            <Empty id='120' />, <Empty id='121' />, <Empty id='122' />, <M1 id='123' />, <M1 id='124' />, <M1 id='125' />, <Empty id='126' />, <M1 id='127' />, <Empty id='128' />, <Empty id='129' />, <Empty id='130' />, <M1 id='131' />, <M1 id='132' />, <Empty id='133' />, <M1 id='134' />, <M1 id='135' />, <M1 id='136' />, <M1 id='137' />, <M1 id='138' />, <M1 id='139' />, 
            <Empty id='140' />, <Empty id='141' />, <Empty id='142' />, <M1 id='143' />, <M1 id='144' />, <M1 id='145' />, <Empty id='146' />, <M1 id='147' />, <M1 id='148' />, <Empty id='149' />, <M1 id='150' />, <M1 id='151' />, <M1 id='152' />, <Empty id='153' />, <M1 id='154' />, <M1 id='155' />, <M1 id='156' />, <M1 id='157' />, <M1 id='158' />, <M1 id='159' />, 
            <Empty id='160' />, <Empty id='161' />, <Empty id='162' />, <M1 id='163' />, <M1 id='164' />, <M1 id='165' />, <Empty id='166' />, <M1 id='167' />, <Empty id='168' />, <Empty id='169' />, <Empty id='170' />, <M1 id='171' />, <M1 id='172' />, <Empty id='173' />, <M1 id='174' />, <M1 id='175' />, <M1 id='176' />, <M1 id='177' />, <M1 id='178' />, <M1 id='179' />, 
            <Empty id='180' />, <Empty id='181' />, <Empty id='182' />, <M1 id='183' />, <M1 id='184' />, <M1 id='185' />, <Empty id='186' />, <M1 id='187' />, <Empty id='188' />, <Empty id='189' />, <Empty id='190' />, <M1 id='191' />, <M1 id='192' />, <Empty id='193' />, <M1 id='194' />, <M1 id='195' />, <M1 id='196' />, <M1 id='197' />, <M1 id='198' />, <M1 id='199' />, 
            <Empty id='200' />, <Empty id='201' />, <Empty id='202' />, <M1 id='203' />, <M1 id='204' />, <M1 id='205' />, <Empty id='206' />, <M1 id='207' />, <Empty id='208' />, <Empty id='209' />, <Empty id='210' />, <M1 id='211' />, <M1 id='212' />, <Empty id='213' />, <M1 id='214' />, <M1 id='215' />, <M1 id='216' />, <M1 id='217' />, <M1 id='218' />, <M1 id='219' />, 
            <Empty id='220' />, <Empty id='221' />, <Empty id='222' />, <M1 id='223' />, <M1 id='224' />, <M1 id='225' />, <Empty id='226' />, <M1 id='227' />, <M1 id='228' />, <Empty id='229' />, <M1 id='230' />, <M1 id='231' />, <M1 id='232' />, <Empty id='233' />, <M1 id='234' />, <M1 id='235' />, <M1 id='236' />, <M1 id='237' />, <M1 id='238' />, <M1 id='239' />, 
            <Empty id='240' />, <Empty id='241' />, <Empty id='242' />, <M1 id='243' />, <M1 id='244' />, <M1 id='245' />, <Empty id='246' />, <M1 id='247' />, <Empty id='248' />, <Empty id='249' />, <Empty id='250' />, <M1 id='251' />, <M1 id='252' />, <Empty id='253' />, <M1 id='254' />, <M1 id='255' />, <M1 id='256' />, <M1 id='257' />, <M1 id='258' />, <M1 id='259' />, 
            <Empty id='260' />, <Empty id='261' />, <Empty id='262' />, <M1 id='263' />, <M1 id='264' />, <M1 id='265' />, <Empty id='266' />, <M1 id='267' />, <Empty id='268' />, <Empty id='269' />, <Empty id='270' />, <M1 id='271' />, <M1 id='272' />, <Empty id='273' />, <M1 id='274' />, <M1 id='275' />, <M1 id='276' />, <M1 id='277' />, <M1 id='278' />, <M1 id='279' />, 
            <Empty id='280' />, <Empty id='281' />, <Empty id='282' />, <M1 id='283' />, <M1 id='284' />, <M1 id='285' />, <Empty id='286' />, <M1 id='287' />, <M1 id='288' />, <M1 id='289' />, <M1 id='290' />, <M1 id='291' />, <M1 id='292' />, <Empty id='293' />, <M1 id='294' />, <M1 id='295' />, <M1 id='296' />, <M1 id='297' />, <M1 id='298' />, <M1 id='299' />, 
            <Empty id='300' />, <Empty id='301' />, <Empty id='302' />, <M1 id='303' />, <M1 id='304' />, <M1 id='305' />, <Empty id='306' />, <Empty id='307' />, <Empty id='308' />, <Empty id='309' />, <Empty id='310' />, <Empty id='311' />, <Empty id='312' />, <M1 id='313' />, <M1 id='314' />, <M1 id='315' />, <M1 id='316' />, <M1 id='317' />, <M1 id='318' />, <M1 id='319' />, 
            <Empty id='320' />, <Empty id='321' />, <Empty id='322' />, <M1 id='323' />, <M1 id='324' />, <M1 id='325' />, <M1 id='326' />, <Empty id='327' />, <M1 id='328' />, <M1 id='329' />, <M1 id='330' />, <Empty id='331' />, <Empty id='332' />, <Empty id='333' />, <M1 id='334' />, <M1 id='335' />, <M1 id='336' />, <M1 id='337' />, <M1 id='338' />, <M1 id='339' />, 
            <Empty id='340' />, <Empty id='341' />, <Empty id='342' />, <M1 id='343' />, <M1 id='344' />, <M1 id='345' />, <Empty id='346' />, <Empty id='347' />, <Empty id='348' />, <M1 id='349' />, <M1 id='350' />, <Empty id='351' />, <Empty id='352' />, <Empty id='353' />, <M1 id='354' />, <M1 id='355' />, <M1 id='356' />, <M1 id='357' />, <M1 id='358' />, <M1 id='359' />, 
            <Empty id='360' />, <Empty id='361' />, <Empty id='362' />, <M1 id='363' />, <M1 id='364' />, <M1 id='365' />, <Empty id='366' />, <Empty id='367' />, <Empty id='368' />, <M1 id='369' />, <M1 id='370' />, <Empty id='371' />, <Empty id='372' />, <Empty id='373' />, <M1 id='374' />, <M1 id='375' />, <M1 id='376' />, <M1 id='377' />, <M1 id='378' />, <M1 id='379' />, 
            <Empty id='380' />, <Empty id='381' />, <Empty id='382' />, <M1 id='383' />, <M1 id='384' />, <M1 id='385' />, <Empty id='386' />, <Empty location='first' id='387' />, <Empty id='388' />, <M1 id='389' />, <M1 id='390' />, <M1 id='391' />, <M1 id='392' />, <M1 id='393' />, <M1 id='394' />, <M1 id='395' />, <M1 id='396' />, <M1 id='397' />, <M1 id='398' />, <M1 id='399' />, 
        ];
        this.props.changeLoction(387);
        this.props.changeCurrentMap(areaList);
        return areaList;
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    changeLoction(data){
        dispatch(actionCreators.changeLoction(data))
    },
    changeCurrentMap(data){
        dispatch(actionCreators.changeCurrentMap(data))
    },
});
export default connect(mapState, mapProps)(FirstMap);