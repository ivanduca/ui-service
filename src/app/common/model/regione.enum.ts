import { EnumKeyConverter } from "../helpers/EnumKeyConverter";

export enum Regione {
  R01='Abruzzo',
  R02='Basilicata',
  R04='Calabria',
  R05='Campania',
  R06='Emilia-Romagna',
  R07='Friuli-Venezia Giulia',
  R08='Lazio',
  R09='Liguria',
  R10='Lombardia',
  R11='Marche',
  R12='Molise',
  R13='Piemonte',
  R14='Puglia',
  R15='Sardegna',
  R16='Sicilia',
  R17='Toscana',
  R18='Trentino-Alto Adige/Südtirol',
  R19='Umbria',
  R20='Valle d\'Aosta/Vallée d\'Aoste',
  R21='Veneto'
}

export class RegioneConverter extends EnumKeyConverter<Regione> {
  constructor() {
      super(Regione);
  }

}