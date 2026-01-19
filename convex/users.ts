import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const users = query({
    args:{},
    handler: async(ctx, args) => {
        return await ctx.db.query("users")  
            .order("desc")
            .collect();
    }
});

// 【函数叫什么名字】首先定义函数，叫什么名字，以及里面的结构
// 【声明我要什么数据】接着要声明你的args是什么，你允许输入的是什么，是什么数据类型
// 【具体插入】具体handler，要在哪个表插入？具体插入什么？
// 【返回回执】：将handler定义好的变量，返回给前端。
export const user_creation = mutation({
    args:{
        account: v.string(),
        password: v.string()
    },
    handler: async(ctx, args) => {
        const account_creation = await ctx.db.insert(
            "users", {
                account: args.account,
                password: args.password
            }
        )
        return account_creation
    }
})

