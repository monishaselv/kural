import { BASE_URL } from "../utils/Constants";
import { get } from "../utils/Index";
import { routes } from "../utils/Routes";

export const getKuralApi = (number: any) => {
    return get(`${routes.kural}${number}?appid=ck1pr4cf9fuou&format=json}`, "", BASE_URL);
};