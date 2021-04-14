import React, { useContext } from 'react'
import { ctx } from '../context'
import styles from './rulebox.scss'

export default function Timebox(props) {
  const { gData } = useContext(ctx)
  const { activityRule, actvityConvertRule } = gData

  return (
    <>
      <img className={styles.rulerbg} src={`${props.baseImg}print@2x.png`} alt="" />
      <div className={styles.rulebox}>
        {activityRule && (
          <div className={styles.rule}>
            <h3>规则说明</h3>
            <p dangerouslySetInnerHTML={{ __html: activityRule }} />
          </div>
        )}

        <div className={styles.exchange}>
          <h3>兑换说明</h3>
          <p dangerouslySetInnerHTML={{ __html: actvityConvertRule }} />
        </div>
      </div>
    </>
  )
}
