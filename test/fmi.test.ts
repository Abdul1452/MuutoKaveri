import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSimpleXml, summariseByDay } from "../server/fmi";

// Shape of FMI's "simple" WFS answer, trimmed to a few elements.
const element = (time: string, name: string, value: string) => `
  <wfs:member>
    <BsWfs:BsWfsElement gml:id="BsWfsElement.1.1.1">
      <BsWfs:Location><gml:Point gml:id="BsWfsElementP.1.1.1" srsDimension="2" srsName="http://www.opengis.net/def/crs/EPSG/0/4258"><gml:pos>60.45148 22.26869 </gml:pos></gml:Point></BsWfs:Location>
      <BsWfs:Time>${time}</BsWfs:Time>
      <BsWfs:ParameterName>${name}</BsWfs:ParameterName>
      <BsWfs:ParameterValue>${value}</BsWfs:ParameterValue>
    </BsWfs:BsWfsElement>
  </wfs:member>`;

const collection = (members: string) => `<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection timeStamp="2026-10-18T07:00:00Z" numberMatched="4" numberReturned="4"
  xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:gml="http://www.opengis.net/gml/3.2"
  xmlns:BsWfs="http://xml.fmi.fi/schema/wfs/2.0">${members}
</wfs:FeatureCollection>`;

test("parses FMI simple XML into rows, keeping missing values as null", () => {
  const rows = parseSimpleXml(
    collection(
      element("2026-10-18T09:00:00Z", "Temperature", "3.4") +
        element("2026-10-18T09:00:00Z", "WindSpeedMS", "7.1") +
        element("2026-10-18T09:00:00Z", "Precipitation1h", "NaN") +
        element("2026-10-18T22:00:00Z", "Temperature", "-1.5"),
    ),
  );
  assert.deepEqual(rows, [
    { time: "2026-10-18T09:00:00Z", name: "temperature", value: 3.4 },
    { time: "2026-10-18T09:00:00Z", name: "windspeedms", value: 7.1 },
    { time: "2026-10-18T09:00:00Z", name: "precipitation1h", value: null },
    { time: "2026-10-18T22:00:00Z", name: "temperature", value: -1.5 },
  ]);
  // 22:00 UTC is already the next day in Helsinki.
  assert.deepEqual(
    summariseByDay(rows).map((d) => [d.date, d.minTemp]),
    [
      ["2026-10-18", 3.4],
      ["2026-10-19", -1.5],
    ],
  );
});

test("parses a single member and an empty or unrelated answer", () => {
  assert.equal(parseSimpleXml(collection(element("2026-10-18T09:00:00Z", "Temperature", "1"))).length, 1);
  assert.deepEqual(parseSimpleXml(collection("")), []);
  assert.deepEqual(parseSimpleXml("<ExceptionReport><Exception>No locations found</Exception></ExceptionReport>"), []);
});
