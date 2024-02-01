import database from "./../database";
import Schemas from "./../schema";

const StateModel = database.model('StateModel', Schemas.StateSchema);
const CityModel = database.model('CityModel', Schemas.CitySchema);

const AttorneyModel = database.model('AttorneyModel', Schemas.AttorneySchema);
const embeddedVideoModel = database.model('embeddedVideoModel', Schemas.embeddedVideosSchema);
const FAQModel = database.model('FAQModel', Schemas.FAQSchema);
const HeaderModel = database.model('HeaderModel', Schemas.HeaderSchema);
const PageModel = database.model('PageModel', Schemas.PageSchema);

export default Object.freeze({
    StateModel,
    CityModel,
    AttorneyModel,
    embeddedVideoModel,
    FAQModel,
    HeaderModel,
    PageModel,
});