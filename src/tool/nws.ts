import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Helper function for making NWS API requests
const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// NWS 알림 도구 등록
export function registerNwsTool(mcp: McpServer) {
  // NWS 알림 도구 등록
  mcp.tool(
    "get-alerts",
    "Get weather alerts for a state",
    {
      state: z.string()
        .length(2)
        .describe("Two-letter state code (e.g. CA, NY)")
        .transform(val => val.toUpperCase()),
    },
    async ({ state }) => {
      const alertsUrl = `${NWS_API_BASE}/alerts?area=${state}`;
      const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

      if (!alertsData) {
        return {
          content: [{
            type: "text",
            text: "Failed to retrieve alerts data",
          }],
        };
      }

      const features = alertsData.features || [];
      if (features.length === 0) {
        return {
          content: [{
            type: "text",
            text: `No active alerts for ${state}`,
          }],
        };
      }

      const formattedAlerts = features.map(formatAlert);
      const alertsText = `Active alerts for ${state}:\n\n${formattedAlerts.join("\n")}`;

      return {
        content: [{
          type: "text",
          text: alertsText,
        }],
      };
    }
  );
}

// Helper function for making NWS API requests
async function makeNWSRequest<T>(url: string): Promise<T | null> {
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/geo+json",
  };

  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // 실제 API 호출처럼 비동기 동작 모사
    const mockResponse = {
      features: [
        {
          properties: {
            event: "호우주의보",
            areaDesc: "캘리포니아", 
            severity: "보통",
            status: "활성",
            headline: "호우주의보 발효"
          }
        }
      ] as AlertFeature[]
    };
    return mockResponse as T;
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
}

interface AlertFeature {
  properties: {
    event?: string;
    areaDesc?: string;
    severity?: string;
    status?: string;
    headline?: string;
  };
}

interface AlertsResponse {
  features: AlertFeature[];
}

// Format alert data
function formatAlert(feature: AlertFeature): string {
  const props = feature.properties;
  return [
    `Event: ${props.event || "Unknown"}`,
    `Area: ${props.areaDesc || "Unknown"}`,
    `Severity: ${props.severity || "Unknown"}`,
    `Status: ${props.status || "Unknown"}`,
    `Headline: ${props.headline || "No headline"}`,
    "---",
  ].join("\n");
}

interface ForecastPeriod {
  name?: string;
  temperature?: number;
  temperatureUnit?: string;
  windSpeed?: string;
  windDirection?: string;
  shortForecast?: string;
}

interface PointsResponse {
  properties: {
    forecast?: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: ForecastPeriod[];
  };
}