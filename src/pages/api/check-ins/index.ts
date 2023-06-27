import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { checkInValidationSchema } from 'validationSchema/check-ins';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCheckIns();
    case 'POST':
      return createCheckIn();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCheckIns() {
    const data = await prisma.check_in
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'check_in'));
    return res.status(200).json(data);
  }

  async function createCheckIn() {
    await checkInValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.check_in.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
