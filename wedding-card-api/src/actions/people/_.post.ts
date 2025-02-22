import { Inject } from "@ipare/inject";
import { Action } from "@ipare/router";
import { Admin } from "../../decorators/admin";
import { CollectionService } from "../../services/collection.service";

/**
 * @openapi
 * /people:
 *   post:
 *     tags:
 *       - people
 *     description: Invite someone
 *     requestBody:
 *       description: User info
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name:
 *                 type: string
 *                 description: someone's name
 *     responses:
 *       204:
 *         description: success
 *     security:
 *       - admin: []
 */

@Admin
export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const name = this.ctx.req.body.name;
    if (!name) {
      this.badRequestMsg({ message: "请填写人名" });
      return;
    }

    const countRes = await this.collectionService.people
      .where({
        _id: name,
      })
      .count();
    if (!!countRes.total) {
      this.noContent();
      return;
    }

    await this.collectionService.people.add({
      _id: name,
    });
    this.noContent();
  }
}
