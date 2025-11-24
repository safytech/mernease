import mongoose from "mongoose";

/**
 * Build viewType and ownerId filters
 * Supports:
 *   - viewType=own  → restricts to createdBy=ownerId
 *   - viewType=self → restricts to _id=ownerId
 *
 * @param {Object} req - Express request object
 * @returns {Object} { filterValues, ownerObjectId }
 */
export function buildViewFilter(req) {
  const viewType = req.query.viewType;
  const ownerId = req.query.ownerId;
  const filterValues = {};

  let ownerObjectId = null;
  if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
    ownerObjectId = new mongoose.Types.ObjectId(ownerId);
  }

  if (viewType === "own" && ownerObjectId) {
    filterValues.createdBy = ownerObjectId;
  } else if (viewType === "self" && ownerObjectId) {
    filterValues._id = ownerObjectId;
  }

  return { filterValues, ownerObjectId };
}

/**
 * Parse pagination, sorting, and search query params.
 *
 * @param {Object} req - Express request object
 * @param {Object} [defaults] - Optional defaults for sortField or limit
 * @returns {Object} { page, limit, sortField, sortOrder, search }
 */
export function parseListQuery(req, defaults = {}) {
  const page = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.per_page, 10) || defaults.limit || 10;
  const sortField = req.query.sortField || defaults.sortField || "createdAt";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const search = req.query.search ? req.query.search.trim() : "";

  return { page, limit, sortField, sortOrder, search };
}

/**
 * Combines viewType/ownerId and pagination/sorting/search
 *
 * @param {Object} req - Express request object
 * @param {Object} [defaults] - Optional defaults for limit or sortField
 * @returns {Object} { filterValues, ownerObjectId, page, limit, sortField, sortOrder, search }
 */
export function buildQueryHelpers(req, defaults = {}) {
  const { filterValues, ownerObjectId } = buildViewFilter(req);
  const { page, limit, sortField, sortOrder, search } = parseListQuery(req, defaults);
  return { filterValues, ownerObjectId, page, limit, sortField, sortOrder, search };
}

/**
 * Execute aggregation pipeline with pagination and total count
 *
 * @param {MongooseModel} model - Mongoose model to aggregate
 * @param {Array} basePipeline - Core aggregation stages (before pagination)
 * @param {Object} options - { page, limit, sortField, sortOrder }
 * @returns {Promise<{ data: Array, totalRowCount: number }>}
 */
export async function runPaginatedAggregation(
  model,
  basePipeline,
  { page = 0, limit = 10, sortField = "createdAt", sortOrder = -1 } = {}
) {
  const sortConfig = {};
  sortConfig[sortField] = sortOrder;

  const listQuery = [
    ...basePipeline,
    { $sort: sortConfig },
    { $skip: page * limit },
    { $limit: limit },
  ];

  const totalQuery = [...basePipeline, { $count: "total_count" }];

  const [data, totalResult] = await Promise.all([
    model.aggregate(listQuery),
    model.aggregate(totalQuery),
  ]);

  const totalRowCount = totalResult.length > 0 ? totalResult[0].total_count : 0;

  return { data, totalRowCount };
}
