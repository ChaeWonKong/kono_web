/* global kakao */

import React, { useEffect, useState } from "react"
import { konoAPI } from "../api"
import { IKonoList } from '../shared-interfaces'

declare global {
    interface Window {
        kakao: any;
    }
}

const Map: React.FC = () => {


    // Set Map to state
    const [map, setMap] = useState()

    // Set konoList to state
    const [konoList, setKonoList] = useState()

    useEffect(() => {
        // Set Kakao Map
        let [x, y] = [127.0507571, 37.5030042]
        getKonoList(x, y)

        if (window.kakao) {
            let options = { //지도를 생성할 때 필요한 기본 옵션
                center: new window.kakao.maps.LatLng(y, x), //지도의 중심좌표.
                // center: new window.kakao.maps.LatLng(127.0507571, 37.5030042),
                level: 3//지도의 레벨(확대, 축소 정도)
            };

            let container = document.getElementById('map')

            let map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
            // if (container) map.relayout()
            setMap(map)
        }

    }, [])

    useEffect(() => {
        // 마커가 표시될 위치입니다 
        if (konoList && map) {
            konoList.map((place: IKonoList) => {
                let { x, y, name } = place
                console.log(name)
                let latlng = new window.kakao.maps.LatLng(y, x)

                let marker = new window.kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: latlng,
                    title: name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                });

                var infowindow = new window.kakao.maps.InfoWindow({
                    position: latlng,
                    content: `<div style="padding: 4px; ">${name}</div>`
                });

                // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
                infowindow.open(map, marker);
                marker.setMap(map)
            })
        }
    }, [konoList])

    const getKonoList = async (x: number, y: number): Promise<void> => {
        let data = await konoAPI.getKonoList(x, y)
        setKonoList(data)
    }

    console.log(konoList)
    return (
        <div id="map" style={mapStyle}>

        </div>
    )
}

const mapStyle = {
    width: "100vw",
    height: "100vh",
}

export default Map