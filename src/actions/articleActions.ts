"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "@/models/Article";
import { Article, DUMMY_ARTICLE_IDS } from "@/data/portfolioData";

export interface ArticleActionResult {
  success: boolean;
  article?: Article;
  articles?: Article[];
  message?: string;
  error?: string;
}

export async function getArticlesAction(): Promise<ArticleActionResult> {
  try {
    await connectToDatabase();
    await ArticleModel.deleteMany({ id: { $in: DUMMY_ARTICLE_IDS } });
    const docs = await ArticleModel.find().sort({ createdAt: -1 }).lean();
    const articles: Article[] = (docs || []).map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      readTime: a.readTime,
      publishedDate: a.publishedDate,
      excerpt: a.excerpt,
      content: a.content || [],
      slug: a.slug,
      tags: a.tags || [],
    }));
    return { success: true, articles };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch articles";
    return { success: false, error: message };
  }
}

export async function addArticleAction(article: Article): Promise<ArticleActionResult> {
  try {
    if (!article || !article.title) {
      return { success: false, error: "Article data and title are required" };
    }

    await connectToDatabase();

    const cleanArticle = { ...article };
    delete (cleanArticle as Record<string, unknown>)._id;
    delete (cleanArticle as Record<string, unknown>).__v;

    const articleId = cleanArticle.id || `art-${Date.now()}`;
    cleanArticle.id = articleId;

    const saved = await ArticleModel.findOneAndUpdate(
      { id: articleId },
      { $set: cleanArticle },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    revalidatePath("/articles");
    revalidatePath("/");

    return {
      success: true,
      message: "Article saved to MongoDB Atlas",
      article: {
        id: saved.id,
        title: saved.title,
        category: saved.category,
        readTime: saved.readTime,
        publishedDate: saved.publishedDate,
        excerpt: saved.excerpt,
        content: saved.content || [],
        slug: saved.slug,
        tags: saved.tags || [],
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add article";
    console.error("addArticleAction error:", error);
    return { success: false, error: message };
  }
}

export async function updateArticleAction(
  id: string,
  updatedFields: Partial<Article>
): Promise<ArticleActionResult> {
  try {
    if (!id) {
      return { success: false, error: "Article ID is required" };
    }

    await connectToDatabase();

    const cleanFields = { ...updatedFields };
    delete (cleanFields as Record<string, unknown>)._id;
    delete (cleanFields as Record<string, unknown>).__v;

    const cleanId = String(id).trim();
    const query = cleanId.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ id: cleanId }, { _id: cleanId }] }
      : { id: cleanId };

    const updated = await ArticleModel.findOneAndUpdate(
      query,
      { $set: cleanFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return { success: false, error: "Article not found in database" };
    }

    revalidatePath("/articles");
    revalidatePath("/");

    return {
      success: true,
      message: "Article updated in MongoDB Atlas",
      article: {
        id: updated.id,
        title: updated.title,
        category: updated.category,
        readTime: updated.readTime,
        publishedDate: updated.publishedDate,
        excerpt: updated.excerpt,
        content: updated.content || [],
        slug: updated.slug,
        tags: updated.tags || [],
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update article";
    console.error("updateArticleAction error:", error);
    return { success: false, error: message };
  }
}

export async function deleteArticleAction(id: string): Promise<ArticleActionResult> {
  try {
    if (!id) {
      return { success: false, error: "Article ID is required" };
    }

    await connectToDatabase();

    const cleanId = String(id).trim();
    const query = cleanId.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ id: cleanId }, { _id: cleanId }] }
      : { id: cleanId };

    const deleted = await ArticleModel.findOneAndDelete(query);
    if (!deleted) {
      return { success: false, error: "Article not found to delete" };
    }

    revalidatePath("/articles");
    revalidatePath("/");

    return { success: true, message: "Article deleted from database." };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete article";
    console.error("deleteArticleAction error:", error);
    return { success: false, error: message };
  }
}
