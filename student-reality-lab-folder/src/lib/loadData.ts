import rawDebtOverTimeData from "../data/processed.json";
import { parseDebtOverTimeData } from "./schema";

export const loadDebtOverTimeData = () => parseDebtOverTimeData(rawDebtOverTimeData);
