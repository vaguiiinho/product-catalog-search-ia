import { ProductPrice } from "./product-price.value-object";
import { RequiredText } from "./required-text.value-object";

const PRICE_QUERY_PATTERN =
  /(?:r\$\s*|(?:pre[cç]o|valor|custa(?:ndo)?|por)\s*(?:de\s*)?(?:r\$\s*)?)(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})|\d+(?:[.,]\d{1,2})?)/iu;
const TRAILING_DECIMAL_PRICE_PATTERN =
  /(?:^|\s)(\d{1,3}(?:\.\d{3})*,\d{2}|\d+\.\d{2})\s*$/u;

export class ProductSearchQuery {
  private constructor(
    public readonly original: string,
    public readonly text: string,
    public readonly price?: number,
  ) {}

  static create(value: string) {
    const original = RequiredText.create(value, "Consulta", 500).value;
    const priceMatch =
      original.match(PRICE_QUERY_PATTERN) ??
      original.match(TRAILING_DECIMAL_PRICE_PATTERN);

    if (!priceMatch) {
      return new ProductSearchQuery(original, original);
    }

    const price = ProductPrice.create(parseBrazilianPrice(priceMatch[1])).value;
    const text = original
      .replace(priceMatch[0], " ")
      .replace(/\s+/g, " ")
      .replace(/\b(?:de|do|da|com|por)\s*$/iu, "")
      .trim();

    return new ProductSearchQuery(original, text, price);
  }
}

function parseBrazilianPrice(value: string) {
  const normalized = value.includes(",")
    ? value.replace(/\./g, "").replace(",", ".")
    : value;

  return Number(normalized);
}
