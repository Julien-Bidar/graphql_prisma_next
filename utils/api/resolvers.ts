import { verifyOwnership } from "./verifyOwnership"

/**
 * custom resolver for fields coming from other query see commented out author inside Feed below
 * {@param parName: String} parameter name (author in the example below)
 * {@param modelName: String} modelName the original query (Feed in the example below)
 */
const createFieldResolvers = (modelName, parName) => ({
    [parName]: async ({id}, args, {prisma}) => {
        const modelResponse = await prisma[modelName].findUnique({
            where: {id},
            include: { [parName]: true }
        })
        // console.log(modelResponse)
        return modelResponse[parName]
    }
})

export const resolvers = {
    Feed: {
        // author: ({authorId}, args, {prisma}) => {
        //     return prisma.user.findUnique({where: {id: authorId}})
        // }
        ...createFieldResolvers('feed', 'author'),
        ...createFieldResolvers('feed', 'tags'),
        ...createFieldResolvers('feed', 'bundles'),
        ...createFieldResolvers('feed', 'likes')
    },
    Bundle: {
        ...createFieldResolvers('bundle', 'author'),
        ...createFieldResolvers('bundle', 'tags'),
        ...createFieldResolvers('bundle', 'feeds'),
        ...createFieldResolvers('bundle', 'likes')
    },
    BundleTag:{
        ...createFieldResolvers('bundleTag', 'bundles')
    },
    FeedTag: {
        ...createFieldResolvers('feedTag', 'feeds')
    },
    SavedArticle: {
        ...createFieldResolvers('savedArticle', 'author'),
        ...createFieldResolvers('savedArticle', 'feed')
    },
    User : {
        ...createFieldResolvers('user', 'bundles'),
        ...createFieldResolvers('user', 'feeds'),
        ...createFieldResolvers('user', 'feedLikes'),
        ...createFieldResolvers('user', 'bundleLikes'),
    },
    Query: {
        hello: (parent, args, context) => "hi!",
        feed: (parent, {data: {id}}, {prisma}) => prisma.feed.findUnique({where: {id}}),
        feeds: (parent, args, {prisma}) => prisma.feed.findMany(),
        bundle: (parent, {data: {id}}, {prisma}) => prisma.bundle.findUnique({where: {id}}),
        bundles: (parent, args, {prisma}) => prisma.bundle.findMany(),
        findFeedTags: (parent, {data}, {prisma}) => prisma.feedTag.findMany({where: {name: {contains: data.search}}}),
        findBundleTags: (parent, {data}, {prisma}) => prisma.bundleTag.findMany({where: {name: {contains: data.search}}}),
        findFeeds: (parent, {data}, {prisma}) => prisma.feed.findMany({where: {name: {contains: data.search}}}),
        savedArticle: async (parent, {data: {url}}, {prisma, user: {id: authorId}}) => {
            const savedArticles = await prisma.savedArticle.findMany({
                where: {url, authorId},
            })
            return savedArticles[0]
        },
        savedArticles: (parent, args, {prisma, user: {id: authorId}}) => {
            return prisma.savedArticle.findMany({where: {authorId : authorId ? authorId : null}})
        },
        me: (parent, args, {prisma, user: {id}}) => prisma.user.findUnique({where: {id}})
    },
    Mutation: {
        createFeed: async (parent, {data}, {prisma, user}) => {
            const author = {author : {connect : {id: user.id}}}
            const result = await prisma.feed.create({data: {...data, ...author}});
            return result;
        },
        createBundle: async (parent, {data}, {prisma, user}) => {
            const author = {author : {connect : {id: user.id}}}
            const result = await prisma.bundle.create({data: {...data, ...author}});
            return result;
        },
        likeBundle: async (parent, {data}, {prisma, user}) => {
            const {bundleId, likeState} = data
            const connectState = likeState ? 'connect' : 'disconnect'
            return prisma.bundle.update({
                where: {id: bundleId},
                data: {likes : { [connectState]: {id: user.id}}}
            })
        },
        likeFeed: async (parent, {data}, {prisma, user}) => {
            const {feedId, likeState} = data
            const connectState = likeState ? 'connect' : 'disconnect'
            return prisma.feed.update({
                where: {id: feedId},
                data: {likes : {[connectState]: {id: user.id}}}
            })
        },
        updateFeed: async (parent, {data: {id, ...feedUpdate}}, {prisma, user}) => {
            const feed = await prisma.feed.findUnique({where: {id}, include: {author: true}})
            await verifyOwnership(feed, user)
            return prisma.feed.update({where: {id}, data: {...feedUpdate}})
        },
        updateBundle: async (parent, {data: {id, ...bundleUpdate}}, {prisma, user}) => {
            const bundle = await prisma.bundle.findUnique({where: {id}, include: {author: true}})
            await verifyOwnership(bundle, user)
            return prisma.bundle.update({where: {id}, data: {...bundleUpdate}})
        },
        createSavedArticle: async(parent, {data}, {prisma, user}) => {
            const author = {author: {connect: {id: user.id}}}
            return prisma.savedArticle.create({data: {...data, ...author}})
        },
        deleteBundle: async (parent, {data: {id}}, {prisma, user}) => {
            const bundle = await prisma.bundle.findUnique({where: {id}, include: {author: true}})
            await verifyOwnership(bundle, user)
            await prisma.bundle.delete({where: {id: bundle.id}})
            return bundle
        },
        deleteFeed: async (parent, {data: {id}}, {prisma, user}) => {
            const feed = await prisma.feed.findUnique({where: {id}, include: {author: true}})
            await verifyOwnership(feed, user)
            await prisma.feed.delete({where: {id: feed.id}})
            return feed
        }, 
        deleteSavedArticle: async (parent, {data: {id}}, {prisma, user})=> {
            const savedArticle = await prisma.savedArticle.findUnique({where: {id}, include: {author: true}})
            await verifyOwnership(savedArticle, user)
            await prisma.savedArticle.delete({where: {id: savedArticle.id}})
            return savedArticle
        }
    }
}